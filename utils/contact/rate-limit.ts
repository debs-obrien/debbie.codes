import { createHash } from 'node:crypto'
import { CONTACT_LIMITS } from './constants'

export interface RateLimitRecord {
  /** Timestamps (ms) of recent submissions in the burst window. */
  burst: number[]
  /** Timestamps (ms) of submissions in the day window. */
  day: number[]
}

export interface RateLimitStore {
  get: (key: string) => Promise<RateLimitRecord | null>
  set: (key: string, value: RateLimitRecord) => Promise<void>
  getGlobal: () => Promise<number[]>
  setGlobal: (timestamps: number[]) => Promise<void>
}

export type RateLimitResult
  = | { ok: true }
    | { ok: false, code: 'rate_limit' }

export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter(t => now - t < windowMs)
}

/**
 * Check and record a submission for the given IP hash.
 * Mutates the store on success.
 */
export async function checkAndRecordRateLimit(
  store: RateLimitStore,
  ipHash: string,
  nowMs: number = Date.now(),
): Promise<RateLimitResult> {
  const global = prune(
    (await store.getGlobal()) || [],
    CONTACT_LIMITS.rateLimitDayWindowMs,
    nowMs,
  )
  if (global.length >= CONTACT_LIMITS.rateLimitGlobalDay)
    return { ok: false, code: 'rate_limit' }

  const existing = (await store.get(ipHash)) || { burst: [], day: [] }
  const burst = prune(existing.burst, CONTACT_LIMITS.rateLimitBurstWindowMs, nowMs)
  const day = prune(existing.day, CONTACT_LIMITS.rateLimitDayWindowMs, nowMs)

  if (burst.length >= CONTACT_LIMITS.rateLimitBurst)
    return { ok: false, code: 'rate_limit' }
  if (day.length >= CONTACT_LIMITS.rateLimitDay)
    return { ok: false, code: 'rate_limit' }

  burst.push(nowMs)
  day.push(nowMs)
  global.push(nowMs)

  await store.set(ipHash, { burst, day })
  await store.setGlobal(global)

  return { ok: true }
}

/** In-memory store for unit tests and local Nitro fallback. */
export function createMemoryRateLimitStore(): RateLimitStore {
  const map = new Map<string, RateLimitRecord>()
  let global: number[] = []
  return {
    async get(key) {
      return map.get(key) ?? null
    },
    async set(key, value) {
      map.set(key, value)
    },
    async getGlobal() {
      return global
    },
    async setGlobal(timestamps) {
      global = timestamps
    },
  }
}
