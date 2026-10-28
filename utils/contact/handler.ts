import type { ContactErrorCode } from './constants'
import type { RateLimitStore } from './rate-limit'
import type { ContactFieldErrors } from './validate'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { createChallenge, verifyChallenge } from './challenge'
import { CONTACT_FORM_NAME, CONTACT_LIMITS } from './constants'
import { checkAndRecordRateLimit, hashIp } from './rate-limit'
import {
  parseContactBody,
  rejectExtraFields,
  validateContactSubmission,
} from './validate'

export interface ContactHandlerDeps {
  secret: string
  ipSalt: string
  rateLimitStore: RateLimitStore
  /** Absolute site origin used to POST into Netlify Forms. */
  siteOrigin: string
  /** Optional fetch override (tests). */
  fetchFn?: typeof fetch
  nowMs?: () => number
}

export interface ContactHandlerResult {
  status: number
  body: Record<string, unknown>
}

function json(
  status: number,
  body: Record<string, unknown>,
): ContactHandlerResult {
  return { status, body }
}

function errorBody(
  code: ContactErrorCode,
  extra?: { fields?: ContactFieldErrors, message?: string },
): Record<string, unknown> {
  return {
    ok: false,
    code,
    ...(extra?.fields ? { fields: extra.fields } : {}),
    ...(extra?.message ? { message: extra.message } : {}),
  }
}

export function issueContactChallenge(deps: ContactHandlerDeps): ContactHandlerResult {
  const now = deps.nowMs ? deps.nowMs() : Date.now()
  return json(200, {
    ok: true,
    challenge: createChallenge(deps.secret, now),
  })
}

/**
 * Escape text for plain-text email notifications — strip angle brackets
 * so nothing is interpreted as HTML in Netlify notification templates.
 */
export function sanitizePlainText(value: string): string {
  return value.replace(/[<>]/g, '')
}

export async function handleContactSubmit(
  deps: ContactHandlerDeps,
  options: {
    rawBody: string
    contentType: string | undefined
    clientIp: string
  },
): Promise<ContactHandlerResult> {
  const now = deps.nowMs ? deps.nowMs() : Date.now()
  const fetchFn = deps.fetchFn || fetch

  if (Buffer.byteLength(options.rawBody, 'utf8') > CONTACT_LIMITS.bodyMaxBytes) {
    return json(400, errorBody('payload_too_large'))
  }

  let raw: Record<string, unknown>
  try {
    raw = parseRawBody(options.rawBody, options.contentType)
  }
  catch {
    return json(400, errorBody('validation', { message: 'Invalid body.' }))
  }

  const extra = rejectExtraFields(Object.keys(raw))
  if (extra)
    return json(400, errorBody(extra.code, { message: extra.message }))

  const input = parseContactBody(raw)
  const validated = validateContactSubmission(input)
  if (!validated.ok) {
    if (validated.code === 'honeypot' || validated.code === 'spam')
      return json(400, errorBody(validated.code))
    return json(400, errorBody('validation', { fields: validated.fields }))
  }

  const challenge = verifyChallenge(input.challenge, deps.secret, now)
  if (!challenge.ok) {
    if (challenge.reason === 'too_fast')
      return json(400, errorBody('timing'))
    return json(400, errorBody('timing'))
  }

  const ipHash = hashIp(options.clientIp || 'unknown', deps.ipSalt)
  let rate
  try {
    rate = await checkAndRecordRateLimit(deps.rateLimitStore, ipHash, now)
  }
  catch (err) {
    console.error('contact rate-limit store error', err)
    return json(500, errorBody('server_error'))
  }
  if (!rate.ok)
    return json(429, errorBody('rate_limit'))

  // Forward to Netlify Forms (plain text fields only; no HTML).
  const formBody = new URLSearchParams({
    'form-name': CONTACT_FORM_NAME,
    'name': sanitizePlainText(validated.value.name),
    'email': sanitizePlainText(validated.value.email),
    'reason': validated.value.reason,
    'message': sanitizePlainText(validated.value.message),
    'company-website': '',
  })

  try {
    const res = await fetchFn(deps.siteOrigin, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formBody.toString(),
    })
    // Netlify Forms returns 200 or 303 on success.
    if (!res.ok && res.status !== 303) {
      return json(502, errorBody('forward_failed'))
    }
  }
  catch {
    return json(502, errorBody('forward_failed'))
  }

  // After recording, re-read burst length for deploy-preview diagnostics only.
  // Never includes the raw IP — only a short hash prefix.
  const previewDebug = process.env.CONTEXT === 'deploy-preview'
    ? await (async () => {
        try {
          const rec = await deps.rateLimitStore.get(ipHash)
          return {
            burst: rec?.burst.length ?? 0,
            ipHashPrefix: ipHash.slice(0, 8),
          }
        }
        catch {
          return { burst: -1, ipHashPrefix: ipHash.slice(0, 8) }
        }
      })()
    : undefined

  return json(200, {
    ok: true,
    // Never echo raw input; first name only for success greeting.
    firstName: firstNameOf(validated.value.name),
    ...(previewDebug ? { debug: previewDebug } : {}),
  })
}

function firstNameOf(name: string): string {
  const part = name.trim().split(/\s+/)[0] || ''
  return sanitizePlainText(part).slice(0, CONTACT_LIMITS.nameMax)
}

function parseRawBody(
  rawBody: string,
  contentType: string | undefined,
): Record<string, unknown> {
  const ct = (contentType || '').toLowerCase()
  if (ct.includes('application/json')) {
    const parsed = JSON.parse(rawBody || '{}') as unknown
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
      throw new Error('invalid json')
    return parsed as Record<string, unknown>
  }
  // Default: urlencoded
  const params = new URLSearchParams(rawBody)
  const out: Record<string, unknown> = {}
  for (const [k, v] of params.entries())
    out[k] = v
  return out
}

export function resolveContactSecrets(env: NodeJS.ProcessEnv = process.env): {
  secret: string
  ipSalt: string
  siteOrigin: string
} {
  const siteOrigin = (
    env.URL
    || env.DEPLOY_PRIME_URL
    || env.DEPLOY_URL
    || 'http://127.0.0.1:8000'
  ).replace(/\/$/, '')

  const fallback = env.SITE_ID || 'local-dev-contact'
  const secret = env.CONTACT_HMAC_SECRET || `contact-hmac:${fallback}`
  const ipSalt = env.CONTACT_IP_SALT || `contact-ip:${fallback}`
  return { secret, ipSalt, siteOrigin }
}
