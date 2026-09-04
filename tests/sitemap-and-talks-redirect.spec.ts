import { expect, test } from '@playwright/test'

test.describe('Sitemap and /talks redirect', () => {
  test('/sitemap.xml returns a real sitemap with key routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml')
    expect(res.status()).toBe(200)

    const body = await res.text()
    expect(body).toContain('<urlset')
    expect(body).toContain('https://debbie.codes/speaking')
    expect(body).toContain('https://debbie.codes/blog')
    expect(body).toContain('https://debbie.codes/videos')
    expect(body).toContain('https://debbie.codes/podcasts')
    expect(body).toContain('https://debbie.codes/courses')
    expect(body).toContain('https://debbie.codes/about')
    expect(body).toContain('https://debbie.codes/now')
    // At least one content blog URL from the collection
    expect(body).toMatch(/https:\/\/debbie\.codes\/blog\/[a-z0-9-]+/)
  })

  test('redirects /talks to /speaking', async ({ page }) => {
    await page.goto('/talks')
    await expect(page).toHaveURL(/\/speaking\/?$/)
  })
})
