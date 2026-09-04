import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import process from 'node:process'
import { test, expect } from '@playwright/test'

const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim()

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

  test('_redirects declares permanent /talks → /speaking', () => {
    const redirects = readFileSync(resolve('public/_redirects'), 'utf8')
    expect(redirects).toMatch(/^\/talks\s+\/speaking\s+301\s*$/m)
  })

  test('deploy preview: /talks returns 3xx to /speaking', async ({ request }) => {
    test.skip(!externalBaseURL, 'Netlify _redirects only apply on static hosting (deploy preview)')

    const res = await request.get('/talks', { maxRedirects: 0 })
    expect([301, 302, 308]).toContain(res.status())
    expect(res.headers().location).toMatch(/\/speaking\/?$/)
  })
})
