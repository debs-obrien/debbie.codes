import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { expect, test } from '@playwright/test'

const isEndform = process.env.ENDFORM === 'true'
const blogDir = join('content', 'blog')

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'))
  if (!match)
    return undefined
  return match[1].trim().replace(/^["']|["']$/g, '')
}

/** Titles of published posts sharing the newest frontmatter date in content/blog. */
function newestPublishedBlogTitles(): string[] {
  if (!existsSync(blogDir))
    return []

  const posts: { date: string, title: string }[] = []
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
    const title = frontmatterValue(block, 'title')
    const date = frontmatterValue(block, 'date')?.slice(0, 10)
    if (!title || !date)
      continue
    posts.push({ date, title })
  }
  if (!posts.length)
    return []
  const newestDate = posts.reduce((max, p) => (p.date > max ? p.date : max), posts[0]!.date)
  return posts.filter(p => p.date === newestDate).map(p => p.title)
}

function firstRssItemTitle(xml: string): string | null {
  const itemMatch = xml.match(/<item\b[\s\S]*?<\/item>/i)
  if (!itemMatch)
    return null
  const titleMatch = itemMatch[0].match(/<title>([\s\S]*?)<\/title>/i)
  if (!titleMatch)
    return null
  return titleMatch[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .trim()
}

test.describe('RSS feed', () => {
  test('/feed.xml is RSS 2.0 with newest published post first', { tag: '@smoke' }, async ({ request }) => {
    const res = await request.get('/feed.xml')
    expect(res.status()).toBe(200)

    const contentType = res.headers()['content-type'] ?? ''
    expect(contentType, `content-type was "${contentType}"`).toMatch(/xml/i)

    const body = await res.text()
    expect(body).toMatch(/<rss\b[^>]*\bversion\s*=\s*["']2\.0["']/i)
    expect(body).toMatch(/<channel[\s>]/i)
    expect(body).toMatch(/<channel[\s\S]*?<title>[\s\S]*?<\/title>/i)
    expect(body).toMatch(/<item[\s>]/i)

    const firstTitle = firstRssItemTitle(body)
    expect(firstTitle, 'feed should have a first <item><title>').toBeTruthy()

    const expectedTitles = newestPublishedBlogTitles()
    if (!isEndform && expectedTitles.length > 0) {
      expect(
        expectedTitles,
        `first feed item "${firstTitle}" should be a post with the newest content date`,
      ).toContain(firstTitle)
    }
  })
})
