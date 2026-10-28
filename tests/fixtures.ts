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
 */
import { readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { expect, test as base } from '@playwright/test'

const PLACEHOLDER_PNG = readFileSync(
  join(process.cwd(), 'tests', 'fixtures', 'cloudinary-placeholder.png'),
)

/** True when the request would pull bytes from res.cloudinary.com (directly or via a local/edge image proxy). */
export function isCloudinaryBandwidthRequest(url: string): boolean {
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

type CloudinaryFixtures = {
  blockCloudinary: boolean
}

export const test = base.extend<CloudinaryFixtures>({
  blockCloudinary: [true, { option: true }],

  context: async ({ context, blockCloudinary }, use) => {
    if (blockCloudinary) {
      await context.route('**/*', async (route) => {
        if (!isCloudinaryBandwidthRequest(route.request().url())) {
          await route.continue()
          return
        }
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
      })
    }
    await use(context)
  },
})

export { expect }
