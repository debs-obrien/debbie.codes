import { createHash } from 'node:crypto'
import { CONTACT_LIMITS } from './constants'

export interface RateLimitRecord {
  /** Timestamps (ms) of recent submissions in the burst window. */
  burst: number[]
  /** Timestamps (ms) of submissions in the day window. */
  day: number[]
}

export type ConditionalSetOptions
  = | { onlyIfNew: true }
    | { onlyIfMatch: string }

export interface ConditionalWriteResult {
  modified: boolean
  etag?: string
}

/**
 * Rate-limit store with etag/conditional writes so concurrent Function
 * invocations cannot both pass the same burst/global slot.
 */
export interface RateLimitStore {
  getWithEtag: (key: string) => Promise<{ value: RateLimitRecord | null, etag?: string }>
  setConditional: (
    key: string,
    value: RateLimitRecord,
    opts: ConditionalSetOptions,
  ) => Promise<ConditionalWriteResult>
  getGlobalWithEtag: () => Promise<{ value: number[], etag?: string }>
  setGlobalConditional: (
    timestamps: number[],
    opts: ConditionalSetOptions,
  ) => Promise<ConditionalWriteResult>
}

export type RateLimitResult
  = | { ok: true }
    | { ok: false, code: 'rate_limit' }

const MAX_CAS_RETRIES = 8
const GLOBAL_KEY = 'global:day'

export function hashIp(ip: string, salt: string): string {
  return createHash('sha256').update(`${salt}:${ip}`).digest('hex')
}

function prune(timestamps: number[], windowMs: number, now: number): number[] {
  return timestamps.filter(t => now - t < windowMs)
}

function normalizeRecord(value: RateLimitRecord | null): RateLimitRecord {
  if (!value || typeof value !== 'object')
    return { burst: [], day: [] }
  return {
    burst: Array.isArray(value.burst) ? value.burst.filter(n => typeof n === 'number') : [],
    day: Array.isArray(value.day) ? value.day.filter(n => typeof n === 'number') : [],
  }
}

/**
 * Atomically reserve a slot for this IP (and global) using compare-and-swap
 * retries on etag conflicts.
 */
export async function checkAndRecordRateLimit(
  store: RateLimitStore,
  ipHash: string,
  nowMs: number = Date.now(),
): Promise<RateLimitResult> {
  for (let attempt = 0; attempt < MAX_CAS_RETRIES; attempt++) {
    const globalGot = await store.getGlobalWithEtag()
    const global = prune(globalGot.value || [], CONTACT_LIMITS.rateLimitDayWindowMs, nowMs)
    if (global.length >= CONTACT_LIMITS.rateLimitGlobalDay)
      return { ok: false, code: 'rate_limit' }

    const got = await store.getWithEtag(ipHash)
    const existing = normalizeRecord(got.value)
    const burst = prune(existing.burst, CONTACT_LIMITS.rateLimitBurstWindowMs, nowMs)
    const day = prune(existing.day, CONTACT_LIMITS.rateLimitDayWindowMs, nowMs)

    if (burst.length >= CONTACT_LIMITS.rateLimitBurst)
      return { ok: false, code: 'rate_limit' }
    if (day.length >= CONTACT_LIMITS.rateLimitDay)
      return { ok: false, code: 'rate_limit' }

    const nextBurst = [...burst, nowMs]
    const nextDay = [...day, nowMs]
    const nextGlobal = [...global, nowMs]

    const ipOpts: ConditionalSetOptions = got.etag
      ? { onlyIfMatch: got.etag }
      : { onlyIfNew: true }
    const ipWrite = await store.setConditional(ipHash, { burst: nextBurst, day: nextDay }, ipOpts)
    if (!ipWrite.modified)
      continue

    const globalOpts: ConditionalSetOptions = globalGot.etag
      ? { onlyIfMatch: globalGot.etag }
      : { onlyIfNew: true }
    const globalWrite = await store.setGlobalConditional(nextGlobal, globalOpts)
    if (!globalWrite.modified) {
      // Roll back the IP reservation so a lost global race does not leak a slot.
      // Best-effort: overwrite IP record to previous pruned state without this nowMs.
      await store.setConditional(
        ipHash,
        { burst, day },
        ipWrite.etag ? { onlyIfMatch: ipWrite.etag } : { onlyIfNew: true },
      ).catch(() => undefined)
      continue
    }

    return { ok: true }
  }

  // Contended beyond retries — fail closed as rate limited rather than allow.
  return { ok: false, code: 'rate_limit' }
}

/** In-memory store for unit tests (and explicit local Nitro only). */
export function createMemoryRateLimitStore(): RateLimitStore {
  const map = new Map<string, RateLimitRecord>()
  const etags = new Map<string, string>()
  let global: number[] = []
  let globalEtag: string | undefined
  let seq = 0
  const nextEtag = () => `m-${++seq}`

  return {
    async getWithEtag(key) {
      return { value: map.get(key) ?? null, etag: etags.get(key) }
    },
    async setConditional(key, value, opts) {
      const current = etags.get(key)
      if ('onlyIfNew' in opts && opts.onlyIfNew) {
        if (current)
          return { modified: false }
      }
      else if ('onlyIfMatch' in opts) {
        if (current !== opts.onlyIfMatch)
          return { modified: false }
      }
      map.set(key, value)
      const etag = nextEtag()
      etags.set(key, etag)
      return { modified: true, etag }
    },
    async getGlobalWithEtag() {
      return { value: global, etag: globalEtag }
    },
    async setGlobalConditional(timestamps, opts) {
      if ('onlyIfNew' in opts && opts.onlyIfNew) {
        if (globalEtag)
          return { modified: false }
      }
      else if ('onlyIfMatch' in opts) {
        if (globalEtag !== opts.onlyIfMatch)
          return { modified: false }
      }
      global = timestamps
      globalEtag = nextEtag()
      return { modified: true, etag: globalEtag }
    },
  }
}

export { GLOBAL_KEY }
