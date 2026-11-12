import process from 'node:process'
import { expect, test } from './fixtures'
import { webmcpTools } from '../utils/webmcp/tools'

const TOOL_NAMES = Object.values(webmcpTools).map(tool => tool.name)
const BANNED_VIDEO_IDS = ['A8Gu-ayw6dM', 'yi8b55MLLlg']
const UNPUBLISHED_SLUG = 'webmcp-on-my-site'
const PUBLISHED_SLUGS = [
  'devrel-didnt-die-its-audience-changed',
  'hire-me-voice-agent-grok-bot',
]
const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim()
// @nuxtjs/robots disables indexing in local/dev; mock production so the
// llmstxt comment from robots.groups is present (deploy previews are production).
const robotsPath = externalBaseURL ? '/robots.txt' : '/robots.txt?mockProductionEnv'

test.describe('llms.txt / llms-full.txt / blog markdown', () => {
  test('llms.txt follows llmstxt.org shape and lists registered WebMCP tools', async ({ request }) => {
    const response = await request.get('/llms.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type'] ?? '').toContain('text/plain')
    const body = await response.text()

    expect(body.startsWith('# Debbie Codes')).toBeTruthy()
    expect(body).toMatch(/^>/m)
    expect(body).toContain('## Pages')
    expect(body).toContain('https://debbie.codes/about')
    expect(body).toContain('https://debbie.codes/hire-me')
    expect(body).toContain('## Videos')
    expect(body).toContain('## Blog')
    expect(body).toContain('## Podcasts')
    expect(body).toContain('## Courses')
    expect(body).toContain('## Optional')
    expect(body).toContain('https://debbie.codes/llms-full.txt')
    for (const name of TOOL_NAMES)
      expect(body).toContain(name)
    expect(body).toContain(`/blog/${PUBLISHED_SLUGS[0]}.md`)
    expect(body).not.toContain(UNPUBLISHED_SLUG)
    for (const id of BANNED_VIDEO_IDS)
      expect(body).not.toContain(id)
  })

  test('llms-full.txt lists every published section item newest-first', async ({ request }) => {
    const response = await request.get('/llms-full.txt')
    expect(response.status()).toBe(200)
    expect(response.headers()['content-type'] ?? '').toContain('text/plain')
    const body = await response.text()

    expect(body.startsWith('# Debbie Codes')).toBeTruthy()
    expect(body).toContain('## Videos')
    expect(body).toContain('## Blog')
    expect(body).toContain('## Podcasts')
    expect(body).toContain('## Courses')
    expect(body).toContain('https://debbie.codes/blog/devrel-didnt-die-its-audience-changed')
    expect(body).toContain('https://debbie.codes/blog/devrel-didnt-die-its-audience-changed.md')
    expect(body).toMatch(/tags:/i)
    expect(body).not.toContain(UNPUBLISHED_SLUG)
    for (const id of BANNED_VIDEO_IDS)
      expect(body).not.toContain(id)
    for (const name of TOOL_NAMES)
      expect(body).toContain(name)
  })

  for (const slug of PUBLISHED_SLUGS) {
    test(`/blog/${slug}.md is clean markdown with metadata`, async ({ request }) => {
      const response = await request.get(`/blog/${slug}.md`)
      expect(response.status(), `GET /blog/${slug}.md`).toBe(200)
      const contentType = response.headers()['content-type'] ?? ''
      expect(
        /text\/markdown|text\/plain|text\/x-markdown/i.test(contentType),
        `unexpected content-type for /blog/${slug}.md: ${contentType}`,
      ).toBeTruthy()
      const body = await response.text()
      expect(body).toMatch(/^# /)
      expect(body).toContain('Canonical: https://debbie.codes/blog/')
      expect(body).toContain(`https://debbie.codes/blog/${slug}`)
      expect(body).toContain('- Date:')
      expect(body).not.toContain('<lite-youtube')
      expect(body).not.toContain('::youtube')
      expect(body).not.toContain('published: false')
    })
  }

  test('unpublished blog markdown route is absent', async ({ request }) => {
    const response = await request.get(`/blog/${UNPUBLISHED_SLUG}.md`)
    expect(response.status(), 'unpublished .md must not be published').toBe(404)
  })

  test('every page head links to llms.txt', async ({ page }) => {
    await page.goto('/', { waitUntil: 'domcontentloaded' })
    const link = page.locator('link[rel="alternate"][type="text/plain"][title="llms.txt"]')
    await expect(link).toHaveAttribute('href', 'https://debbie.codes/llms.txt')
  })

  test('blog post head links to the markdown alternate', async ({ page }) => {
    const slug = PUBLISHED_SLUGS[0]
    await page.goto(`/blog/${slug}`, { waitUntil: 'domcontentloaded' })
    const link = page.locator('link[rel="alternate"][type="text/markdown"]')
    await expect(link).toHaveAttribute('href', `https://debbie.codes/blog/${slug}.md`)
  })

  test('robots.txt comments the llms.txt URL', async ({ request }) => {
    const response = await request.get(robotsPath)
    expect(response.status()).toBe(200)
    const body = await response.text()
    expect(body).toMatch(/#\s*LLM context:\s*https:\/\/debbie\.codes\/llms\.txt/i)
    expect(body).toContain('Sitemap: https://debbie.codes/sitemap.xml')
  })
})
