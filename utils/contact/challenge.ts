import { Buffer } from 'node:buffer'
import { createHmac, timingSafeEqual } from 'node:crypto'
import { CONTACT_LIMITS } from './constants'

function b64url(buf: Buffer | string): string {
  const b = typeof buf === 'string' ? Buffer.from(buf, 'utf8') : buf
  return b.toString('base64url')
}

function parseB64url(s: string): Buffer | null {
  try {
    return Buffer.from(s, 'base64url')
  }
  catch {
    return null
  }
}

export function createChallenge(
  secret: string,
  nowMs: number = Date.now(),
): string {
  const ts = String(nowMs)
  const sig = createHmac('sha256', secret).update(ts).digest()
  return `${b64url(ts)}.${b64url(sig)}`
}

export type ChallengeCheck
  = | { ok: true, issuedAtMs: number }
    | { ok: false, reason: 'invalid' | 'too_fast' | 'expired' }

export function verifyChallenge(
  token: string,
  secret: string,
  nowMs: number = Date.now(),
): ChallengeCheck {
  if (!token || typeof token !== 'string')
    return { ok: false, reason: 'invalid' }

  const parts = token.split('.')
  if (parts.length !== 2)
    return { ok: false, reason: 'invalid' }

  const tsBuf = parseB64url(parts[0]!)
  const sigBuf = parseB64url(parts[1]!)
  if (!tsBuf || !sigBuf)
    return { ok: false, reason: 'invalid' }

  const ts = tsBuf.toString('utf8')
  const issuedAtMs = Number(ts)
  if (!Number.isFinite(issuedAtMs))
    return { ok: false, reason: 'invalid' }

  const expected = createHmac('sha256', secret).update(ts).digest()
  if (expected.length !== sigBuf.length || !timingSafeEqual(expected, sigBuf))
    return { ok: false, reason: 'invalid' }

  const ageSec = (nowMs - issuedAtMs) / 1000
  if (ageSec < CONTACT_LIMITS.minSubmitSeconds)
    return { ok: false, reason: 'too_fast' }
  if (ageSec > CONTACT_LIMITS.maxChallengeAgeSeconds || ageSec < 0)
    return { ok: false, reason: 'expired' }

  return { ok: true, issuedAtMs }
}
