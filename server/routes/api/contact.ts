import type { H3Event } from 'h3'
/**
 * Local/dev mirror of `netlify/functions/contact.ts`.
 * Uses an explicit in-memory rate-limit store (local only). Production and
 * deploy previews use Blobs and fail closed if Blobs is unavailable.
 */
import process from 'node:process'
import {
  handleContactSubmit,
  issueContactChallenge,
  resolveContactSecrets,
} from '../../../utils/contact/handler'
import { createMemoryRateLimitStore } from '../../../utils/contact/rate-limit'

const memoryStore = createMemoryRateLimitStore()

function clientIp(event: H3Event): string {
  const xf = getHeader(event, 'x-forwarded-for')
  if (xf)
    return xf.split(',')[0]!.trim()
  return event.node?.req?.socket?.remoteAddress || '127.0.0.1'
}

function isLocalOrigin(origin: string): boolean {
  return /127\.0\.0\.1|localhost/.test(origin)
}

export default defineEventHandler(async (event) => {
  const method = event.method
  const secrets = resolveContactSecrets(process.env)

  // Locally there is no Netlify Forms / edge gate — accept the forward.
  const fetchFn: typeof fetch = isLocalOrigin(secrets.siteOrigin)
    ? (async () => new Response(null, { status: 200 })) as typeof fetch
    : fetch

  const deps = {
    ...secrets,
    rateLimitStore: memoryStore,
    fetchFn,
  }

  if (method === 'OPTIONS') {
    setResponseStatus(event, 204)
    return null
  }

  if (method === 'GET') {
    const result = issueContactChallenge(deps)
    setResponseStatus(event, result.status)
    return result.body
  }

  if (method !== 'POST') {
    setResponseStatus(event, 405)
    return { ok: false, code: 'method_not_allowed' }
  }

  const rawBody = await readRawBody(event, 'utf8') || ''
  const result = await handleContactSubmit(deps, {
    rawBody,
    contentType: getHeader(event, 'content-type') || undefined,
    clientIp: clientIp(event),
  })

  setResponseStatus(event, result.status)
  return result.body
})
