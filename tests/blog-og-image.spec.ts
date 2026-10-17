import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { expect, test } from '@playwright/test'
import { DEFAULT_OG_IMAGE } from '../utils/og-image'

const isEndform = process.env.ENDFORM === 'true'
const blogDir = join('content', 'blog')
const SITE_ORIGIN = 'https://debbie.codes'

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match)
    return undefined
  return match[1].trim().replace(/^["']|["']$/g, '')
}

/** Newest + a couple of older published blog slugs from content/blog. */
function sampleBlogSlugs(): string[] {
  if (!existsSync(blogDir))
    return []

  const posts: { date: string, slug: string }[] = []
  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.md'))
      continue
    const raw = readFileSync(join(blogDir, file), 'utf8')
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/)
    if (!fmMatch)
      continue
    const block = fmMatch[1]
    if (frontmatterValue(block, 'published') === 'false')
      continue
    const date = frontmatterValue(block, 'date')?.slice(0, 10)
    if (!date)
      continue
    posts.push({ date, slug: file.replace(/\.md$/, '') })
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug))
  if (posts.length < 5)
    return posts.map(p => p.slug)

  // Newest 3 + two older posts (mid archive + near the oldest)
  const newest = posts.slice(0, 3).map(p => p.slug)
  const mid = posts[Math.floor(posts.length / 2)]!.slug
  const older = posts[Math.floor(posts.length * 0.8)]!.slug
  return [...new Set([...newest, mid, older])]
}

/** Fetch site-hosted OG assets from the test base URL so unpublished local covers resolve. */
function fetchableImageUrl(absoluteHttps: string, baseURL: string | undefined): string {
  if (!baseURL || !absoluteHttps.startsWith(SITE_ORIGIN))
    return absoluteHttps
  return absoluteHttps.replace(SITE_ORIGIN, baseURL.replace(/\/$/, ''))
}

test.describe('Blog OG / Twitter images', () => {
  test('posts without a cover image fall back to the site default card', async ({ page, request }) => {
    // laid-off-what-now intentionally has no image/ogImage (excluded from cover batches)
    await page.goto('/blog/laid-off-what-now')

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
  test('Grok Bot 50th birthday post uses its local share image and shows a header cover', async ({ page }) => {
    await page.goto('/blog/grok-bot-50th-birthday-photo-video')
    const expected = 'https://debbie.codes/images/blog/covers/grok-bot-50th-birthday-photo-video.png'
    await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', expected)
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', expected)
    // image frontmatter also drives the in-article cover below the title (ogImage alone does not)
    const headerCover = page.locator('article img[alt*="50th birthday"]').first()
    await expect(headerCover).toBeVisible()
    await expect(headerCover).toHaveAttribute('src', /grok-bot-50th-birthday-photo-video/)
  })

  test('sampled posts expose absolute og:image and twitter:image that resolve', async ({ page, request, baseURL }) => {
    const slugs = sampleBlogSlugs()
    test.skip(
      isEndform || slugs.length === 0,
      'content/blog is not available on Endform runners (no repo checkout)',
    )

    for (const slug of slugs) {
      await page.goto(`/blog/${slug}`)

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content')
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content')

      expect(ogImage, `${slug} og:image`).toMatch(/^https:\/\//)
      expect(twitterImage, `${slug} twitter:image`).toMatch(/^https:\/\//)
      expect(ogImage, `${slug} og:image empty`).toBeTruthy()
      expect(twitterImage, `${slug} twitter:image empty`).toBeTruthy()

      for (const url of [ogImage!, twitterImage!]) {
        const fetchUrl = fetchableImageUrl(url, baseURL)
        const imageResponse = await request.get(fetchUrl)
        expect(imageResponse.status(), `${slug} ${fetchUrl} should return 200`).toBe(200)
        expect(
          imageResponse.headers()['content-type'] ?? '',
          `${slug} ${fetchUrl} should be an image`,
        ).toMatch(/image\//i)
      }
    }
  })
})
