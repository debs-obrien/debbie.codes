import { expect, test } from '@playwright/test'
import { DEFAULT_OG_IMAGE } from '../utils/og-image'

test.describe('Blog OG / Twitter images', () => {
  test('posts without a cover image fall back to the site default card', async ({ page, request }) => {
    await page.goto('/blog/back-to-the-gym-after-three-years')

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

    expect(ogImage, 'og:image must not be empty').toBeTruthy()
    expect(twitterImage, 'twitter:image must not be empty').toBeTruthy()
    expect(ogImage).toMatch(/^https:\/\//)
    expect(twitterImage).toMatch(/^https:\/\//)
    expect(ogImage).toBe(DEFAULT_OG_IMAGE)
    expect(twitterImage).toBe(DEFAULT_OG_IMAGE)

    const imageResponse = await request.get(ogImage!)
    expect(imageResponse.status(), `${ogImage} should return 200`).toBe(200)
    expect(imageResponse.headers()['content-type'] ?? '').toMatch(/image\//i)
  })

  test('posts with ogImage frontmatter emit an absolute https URL', async ({ page, request }) => {
    await page.goto('/blog/work-life-balance')

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

    expect(ogImage).toMatch(/^https:\/\//)
    expect(twitterImage).toMatch(/^https:\/\//)
    expect(ogImage).not.toBe(DEFAULT_OG_IMAGE)
    expect(ogImage).toContain('devs-in-the-forest')

    const imageResponse = await request.get(ogImage!)
    expect(imageResponse.status(), `${ogImage} should return 200`).toBe(200)
  })
})
