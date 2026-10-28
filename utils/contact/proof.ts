/**
 * HMAC proof so only the contact Function can submit to Netlify Forms.
 * Uses Web Crypto so Node Functions and Deno Edge can share the algorithm.
 */

function toBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf)
  let binary = ''
  for (const b of bytes)
    binary += String.fromCharCode(b)
  // btoa is available in Functions and Edge; Node 22 also provides it.
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

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

async function hmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  )
}

/** Header name the Function sets and the Edge gate checks. */
export const CONTACT_PROOF_HEADER = 'x-contact-proof'

export async function createFormProof(secret: string, body: string): Promise<string> {
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  return toBase64Url(sig)
}

export async function verifyFormProof(
  secret: string,
  body: string,
  proof: string | null | undefined,
): Promise<boolean> {
  if (!proof || typeof proof !== 'string')
    return false
  const expected = fromBase64Url(proof)
  if (!expected)
    return false
  const key = await hmacKey(secret)
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))
  const actual = new Uint8Array(sig)
  if (actual.length !== expected.length)
    return false
  // Constant-time compare
  let diff = 0
  for (let i = 0; i < actual.length; i++)
    diff |= actual[i]! ^ expected[i]!
  return diff === 0
}

/** True when a urlencoded/multipart body targets the contact form. */
export function bodyTargetsContactForm(body: string): boolean {
  return /(?:^|&)form-name=contact(?:&|$)/.test(body)
    || /(?:^|&)form-name%3Dcontact(?:&|$)/i.test(body)
}
