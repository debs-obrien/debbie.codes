import type { Config, Context } from '@netlify/functions'
import process from 'node:process'
import { getStore } from '@netlify/blobs'
import { createBlobsRateLimitStore } from '../../utils/contact/blobs-store'
import {
  handleContactSubmit,
  issueContactChallenge,
  resolveContactSecrets,
} from '../../utils/contact/handler'
import { createMemoryRateLimitStore } from '../../utils/contact/rate-limit'

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json; charset=utf-8',
}

function clientIp(req: Request, context: Context): string {
  const xf = req.headers.get('x-forwarded-for')
  if (xf)
    return xf.split(',')[0]!.trim()
  const nf = req.headers.get('x-nf-client-connection-ip')
    || req.headers.get('client-ip')
    || req.headers.get('x-real-ip')
  if (nf)
    return nf.trim()
  // Netlify Context may expose IP on some runtimes.
  const ctxIp = (context as { ip?: string }).ip
  return ctxIp || 'unknown'
}

function getRateLimitStore() {
  // Prefer strong consistency when the runtime provides it; otherwise fall
  // back to the default (eventual) store rather than ephemeral memory so
  // limits still apply across invocations.
  try {
    return createBlobsRateLimitStore(
      getStore({ name: 'contact-rate-limit', consistency: 'strong' }) as unknown as Parameters<typeof createBlobsRateLimitStore>[0],
    )
  }
  catch (err) {
    console.warn('contact: strong Blobs unavailable, using default store', err)
    try {
      return createBlobsRateLimitStore(
        getStore('contact-rate-limit') as unknown as Parameters<typeof createBlobsRateLimitStore>[0],
      )
    }
    catch (err2) {
      console.error('contact: Blobs unavailable, using memory store', err2)
      return createMemoryRateLimitStore()
    }
  }
}

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: CORS_HEADERS,
  })
}

export default async (req: Request, context: Context) => {
  if (req.method === 'OPTIONS')
    return new Response(null, { status: 204, headers: CORS_HEADERS })

  const secrets = resolveContactSecrets(process.env)
  const deps = {
    ...secrets,
    rateLimitStore: getRateLimitStore(),
  }

  if (req.method === 'GET') {
    const result = issueContactChallenge(deps)
    return jsonResponse(result.status, result.body)
  }

  if (req.method !== 'POST')
    return jsonResponse(405, { ok: false, code: 'method_not_allowed' })

  const rawBody = await req.text()
  try {
    const result = await handleContactSubmit(deps, {
      rawBody,
      contentType: req.headers.get('content-type') || undefined,
      clientIp: clientIp(req, context),
    })
    return jsonResponse(result.status, result.body)
  }
  catch (err) {
    console.error('contact function error', err)
    return jsonResponse(500, { ok: false, code: 'server_error' })
  }
}

export const config: Config = {
  // Keep the existing /.netlify/functions/contact URL.
  path: '/.netlify/functions/contact',
}
