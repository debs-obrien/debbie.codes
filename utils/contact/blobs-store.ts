import type { RateLimitRecord, RateLimitStore } from './rate-limit'

interface BlobStoreLike {
  get: (key: string, opts: { type: 'json' }) => Promise<unknown>
  setJSON: (key: string, value: unknown) => Promise<void>
}

const GLOBAL_KEY = 'global:day'

/**
 * Netlify Blobs-backed rate limit store. Stores only salted IP hashes as keys
 * and timestamp arrays — never raw IPs or message content.
 */
export function createBlobsRateLimitStore(store: BlobStoreLike): RateLimitStore {
  return {
    async get(key) {
      const value = await store.get(key, { type: 'json' })
      if (!value || typeof value !== 'object')
        return null
      const rec = value as RateLimitRecord
      return {
        burst: Array.isArray(rec.burst) ? rec.burst.filter(n => typeof n === 'number') : [],
        day: Array.isArray(rec.day) ? rec.day.filter(n => typeof n === 'number') : [],
      }
    },
    async set(key, value) {
      await store.setJSON(key, value)
    },
    async getGlobal() {
      const value = await store.get(GLOBAL_KEY, { type: 'json' })
      if (!Array.isArray(value))
        return []
      return value.filter((n): n is number => typeof n === 'number')
    },
    async setGlobal(timestamps) {
      await store.setJSON(GLOBAL_KEY, timestamps)
    },
  }
}
