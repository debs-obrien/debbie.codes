/**
 * Block direct Netlify Forms POSTs for `contact` unless they carry a proof
 * HMAC that only `netlify/functions/contact` can mint. Without this gate,
 * anyone can POST form-name=contact to `/` and skip validation/rate limits.
 *
 * Keeps Forms for storage + email notification (no new paid service).
 * Proof algorithm must stay in sync with `utils/contact/proof.ts`.
 */
import type { Config, Context } from 'https://edge.netlify.com/'

const PROOF_HEADER = 'x-contact-proof'

function fromBase64Url(s: string): Uint8Array | null {
  try {
    const padded = s.replace(/-/g, '+').replace(/_/g, '/')
    const pad = padded.length % 4 === 0 ? '' : '='.repeat(4 - (padded.length % 4))
    const binary = atob(padded + pad)
    const out = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++)
      out[i] = binary.charCodeAt(i)
    return out
  }
  catch {
    return null
  }
}

async function verifyProof(secret: string, body: string, proof: string | null): Promise<boolean> {
  if (!proof)
    return false
  const expected = fromBase64Url(proof)
  if (!expected)
    return false
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const actual = new Uint8Array(sig)
  if (actual.length !== expected.length)
    return false
  let diff = 0
  for (let i = 0; i < actual.length; i++)
    diff |= actual[i]! ^ expected[i]!
  return diff === 0
}

function targetsContactForm(body: string): boolean {
  return /(?:^|&)form-name=contact(?:&|$)/.test(body)
    || /(?:^|&)form-name%3Dcontact(?:&|$)/i.test(body)
}

function resolveSecret(): string {
  const siteId = Deno.env.get('SITE_ID') || 'local-dev-contact'
  return Deno.env.get('CONTACT_HMAC_SECRET') || `contact-hmac:${siteId}`
}

export default async (request: Request, context: Context) => {
  if (request.method !== 'POST')
    return context.next()

  const contentType = (request.headers.get('content-type') || '').toLowerCase()
  if (
    !contentType.includes('application/x-www-form-urlencoded')
    && !contentType.includes('multipart/form-data')
  ) {
    return context.next()
  }

  const body = await request.clone().text()
  if (!targetsContactForm(body))
    return context.next()

  const ok = await verifyProof(resolveSecret(), body, request.headers.get(PROOF_HEADER))
  if (!ok) {
    return new Response(
      JSON.stringify({ ok: false, code: 'forbidden', message: 'Direct form posts are not allowed.' }),
      {
        status: 403,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      },
    )
  }

  return context.next()
}

export const config: Config = {
  path: '/*',
}
