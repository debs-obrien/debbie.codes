import type {
  ConditionalSetOptions,
  ConditionalWriteResult,
  RateLimitRecord,
  RateLimitStore,
} from './rate-limit'
import { GLOBAL_KEY } from './rate-limit'

interface BlobStoreLike {
  getWithMetadata: (
    key: string,
    opts: { type: 'json' },
  ) => Promise<{ data: unknown, etag: string | null } | null>
  setJSON: (
    key: string,
    value: unknown,
    options?: { onlyIfNew?: boolean, onlyIfMatch?: string },
  ) => Promise<{ modified: boolean, etag?: string }>
}

function asRecord(data: unknown): RateLimitRecord | null {
  if (!data || typeof data !== 'object' || Array.isArray(data))
    return null
  const rec = data as RateLimitRecord
  return {
    burst: Array.isArray(rec.burst) ? rec.burst.filter(n => typeof n === 'number') : [],
    day: Array.isArray(rec.day) ? rec.day.filter(n => typeof n === 'number') : [],
  }
}

function asTimestamps(data: unknown): number[] {
  if (!Array.isArray(data))
    return []
  return data.filter((n): n is number => typeof n === 'number')
}

function toSetOpts(opts: ConditionalSetOptions): { onlyIfNew?: boolean, onlyIfMatch?: string } {
  if ('onlyIfNew' in opts && opts.onlyIfNew)
    return { onlyIfNew: true }
  return { onlyIfMatch: (opts as { onlyIfMatch: string }).onlyIfMatch }
}

/**
 * Netlify Blobs-backed rate limit store with conditional writes.
 * Stores only salted IP hashes as keys — never raw IPs or message content.
 */
export function createBlobsRateLimitStore(store: BlobStoreLike): RateLimitStore {
  return {
    async getWithEtag(key) {
      const result = await store.getWithMetadata(key, { type: 'json' })
      if (!result)
        return { value: null }
      return {
        value: asRecord(result.data),
        etag: result.etag || undefined,
      }
    },
    async setConditional(key, value, opts) {
      const write = await store.setJSON(key, value, toSetOpts(opts)) as ConditionalWriteResult
      return {
        modified: Boolean(write?.modified),
        etag: write?.etag,
      }
    },
    async getGlobalWithEtag() {
      const result = await store.getWithMetadata(GLOBAL_KEY, { type: 'json' })
      if (!result)
        return { value: [] }
      return {
        value: asTimestamps(result.data),
        etag: result.etag || undefined,
      }
    },
    async setGlobalConditional(timestamps, opts) {
      const write = await store.setJSON(GLOBAL_KEY, timestamps, toSetOpts(opts)) as ConditionalWriteResult
      return {
        modified: Boolean(write?.modified),
        etag: write?.etag,
      }
    },
  }
}
