import type { APIRequestContext, APIResponse } from '@playwright/test'
/**
 * Shared Playwright test fixtures.
 *
 * Cloudinary bandwidth on the free plan is dominated by CI, deploy previews,
 * and local `nuxt dev` (IPX) — not real visitors. Every test context therefore
 * fulfils Cloudinary (and IPX / Netlify Image CDN proxies that would origin-
 * fetch Cloudinary) with a tiny local placeholder so suites never download
 * real media.
 *
 * Opt out for a specific test with `test.use({ blockCloudinary: false })`.
 *
 * Vercel Deployment Protection: when `VERCEL_OIDC_TOKEN` is set (or a test
 * overrides `vercelOidcToken`), attach `x-vercel-trusted-oidc-idp-token` only
 * to `*.vercel.app` requests — never via repo-wide `extraHTTPHeaders`.
 */
import { Buffer } from 'node:buffer'
import process from 'node:process'
import { test as base, expect } from '@playwright/test'

// Inline 400×200 PNG — Endform runners use cwd=/tmp, so do not read from disk.
const PLACEHOLDER_PNG = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAZAAAADICAIAAABJdyC1AAAB/0lEQVR42u3UMQ0AAAzDsPLHWDBFsWOSDSFHUoAnIgFgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFYFgAhgUYFoBhARgWYFgAhgVgWIBhARgWgGEBhgVgWACGBRgWgGEBhgVgWACGBRgWgGEBGBZgWACGBWBYgGEBGBaAYQGGBWBYAIYFGBaAYQEYFmBYAIYFYFiAYQEYFoBhAYYFcGdOj9ks/HgpswAAAABJRU5ErkJggg==',
  'base64',
)

export const VERCEL_OIDC_HEADER = 'x-vercel-trusted-oidc-idp-token'

/** True when the request would pull bytes from res.cloudinary.com (directly or via a local/edge image proxy). */
function isCloudinaryBandwidthRequest(url: string): boolean {
  if (url.includes('res.cloudinary.com'))
    return true
  // Local Nuxt Image IPX proxy (User-Agent "node" in Cloudinary reports)
  if (url.includes('/_ipx/') && /cloudinary/i.test(url))
    return true
  // Netlify Image CDN origin-fetch of a Cloudinary URL
  if (url.includes('/.netlify/images') && /cloudinary/i.test(url))
    return true
  return false
}

/** Hostname is vercel.app or a subdomain (Deployment Protection host). */
export function isVercelAppHost(url: string, baseURL?: string): boolean {
  try {
    const { hostname } = new URL(url, baseURL)
    return hostname === 'vercel.app' || hostname.endsWith('.vercel.app')
  }
  catch {
    return false
  }
}

type ApiMethod = 'get' | 'post' | 'put' | 'patch' | 'delete' | 'head' | 'fetch'

/**
 * Wrap APIRequestContext so the OIDC header is added only for *.vercel.app.
 * Covers the `request` fixture and `page.request` (webmcp prefetch checks).
 */
export function wrapApiRequestWithVercelOidc(
  request: APIRequestContext,
  token: string | undefined,
  baseURL?: string,
): APIRequestContext {
  if (!token)
    return request

  const methods: ApiMethod[] = ['get', 'post', 'put', 'patch', 'delete', 'head', 'fetch']

  return new Proxy(request, {
    get(target, prop, receiver) {
      if (typeof prop === 'string' && methods.includes(prop as ApiMethod)) {
        const original = Reflect.get(target, prop, receiver) as (
          url: string,
          options?: { headers?: Record<string, string> },
        ) => Promise<APIResponse>
        return (url: string, options: { headers?: Record<string, string> } = {}) => {
          if (isVercelAppHost(url, baseURL)) {
            return original.call(target, url, {
              ...options,
              headers: {
                ...options.headers,
                [VERCEL_OIDC_HEADER]: token,
              },
            })
          }
          return original.call(target, url, options)
        }
      }
      return Reflect.get(target, prop, receiver)
    },
  })
}

interface CloudinaryFixtures {
  blockCloudinary: boolean
  /** Override / inject OIDC token (defaults to VERCEL_OIDC_TOKEN). */
  vercelOidcToken: string | undefined
}

export const test = base.extend<CloudinaryFixtures>({
  blockCloudinary: [true, { option: true }],
  vercelOidcToken: [process.env.VERCEL_OIDC_TOKEN?.trim() || undefined, { option: true }],

  context: async ({ context, blockCloudinary, vercelOidcToken }, use) => {
    const needRoute = blockCloudinary || Boolean(vercelOidcToken)
    if (needRoute) {
      await context.route('**/*', async (route) => {
        const url = route.request().url()

        if (blockCloudinary && isCloudinaryBandwidthRequest(url)) {
          const type = route.request().resourceType()
          // Videos / media: abort so nothing is downloaded. Images: tiny PNG so
          // visibility / naturalWidth assertions still pass.
          if (type === 'media' || type === 'websocket') {
            await route.abort()
            return
          }
          await route.fulfill({
            status: 200,
            contentType: 'image/png',
            body: PLACEHOLDER_PNG,
          })
          return
        }

        if (vercelOidcToken && isVercelAppHost(url)) {
          await route.continue({
            headers: {
              ...route.request().headers(),
              [VERCEL_OIDC_HEADER]: vercelOidcToken,
            },
          })
          return
        }

        await route.continue()
      })
    }
    await use(context)
  },

  // Standalone APIRequestContext (`{ request }` in tests).
  request: async ({ request, baseURL, vercelOidcToken }, use) => {
    await use(wrapApiRequestWithVercelOidc(request, vercelOidcToken, baseURL))
  },

  // page.request (webmcp prefetch / other specs) — not covered by context.route.
  page: async ({ page, baseURL, vercelOidcToken }, use) => {
    if (vercelOidcToken) {
      const wrapped = wrapApiRequestWithVercelOidc(page.request, vercelOidcToken, baseURL)
      Object.defineProperty(page, 'request', {
        configurable: true,
        enumerable: true,
        get: () => wrapped,
      })
    }
    await use(page)
  },
})

export { expect }
