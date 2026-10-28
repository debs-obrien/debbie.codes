import type { Handler, HandlerEvent } from '@netlify/functions'
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { connectLambda, getStore } from '@netlify/blobs'
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

function clientIp(event: HandlerEvent): string {
  const xf = event.headers['x-forwarded-for'] || event.headers['X-Forwarded-For']
  if (typeof xf === 'string' && xf.length > 0)
    return xf.split(',')[0]!.trim()
  const nf = event.headers['x-nf-client-connection-ip']
    || event.headers['client-ip']
    || event.headers['x-real-ip']
  if (typeof nf === 'string' && nf.length > 0)
    return nf.trim()
  return 'unknown'
}

function getRateLimitStore(event: HandlerEvent) {
  try {
    // Classic `export const handler` Functions need connectLambda for Blobs.
    connectLambda(event)
    // Default eventual consistency — strong consistency needs uncachedEdgeURL
    // which classic Functions do not expose on this site.
    const store = getStore('contact-rate-limit')
    // Store.get overloads are wider than our JSON-only adapter needs.
    return createBlobsRateLimitStore(store as unknown as Parameters<typeof createBlobsRateLimitStore>[0])
  }
  catch {
    // Local `netlify functions:serve` without Blobs — fall back to memory.
    return createMemoryRateLimitStore()
  }
}

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS, body: '' }
  }

  const secrets = resolveContactSecrets(process.env)
  const rateLimitStore = getRateLimitStore(event)
  const deps = {
    ...secrets,
    rateLimitStore,
  }

  if (event.httpMethod === 'GET') {
    const result = issueContactChallenge(deps)
    return {
      statusCode: result.status,
      headers: CORS_HEADERS,
      body: JSON.stringify(result.body),
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: false, code: 'method_not_allowed' }),
    }
  }

  const rawBody = event.isBase64Encoded
    ? Buffer.from(event.body || '', 'base64').toString('utf8')
    : (event.body || '')

  const result = await handleContactSubmit(deps, {
    rawBody,
    contentType: event.headers['content-type'] || event.headers['Content-Type'],
    clientIp: clientIp(event),
  })

  return {
    statusCode: result.status,
    headers: CORS_HEADERS,
    body: JSON.stringify(result.body),
  }
}
