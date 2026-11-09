import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { expect, test } from './fixtures';

const isEndform = process.env.ENDFORM === 'true';
const blogDir = join('content', 'blog');

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match)
    return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

/** Titles of published posts sharing the newest frontmatter date in content/blog. */
function newestPublishedBlogTitles(): string[] {
  if (!existsSync(blogDir))
    return [];

  const posts: { date: string, title: string }[] = [];
  for (const file of readdirSync(blogDir)) {
    if (!file.endsWith('.md'))
      continue;
    const raw = readFileSync(join(blogDir, file), 'utf8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch)
      continue;
    const block = fmMatch[1];
    if (frontmatterValue(block, 'published') === 'false')
      continue;
    const title = frontmatterValue(block, 'title');
    const date = frontmatterValue(block, 'date')?.slice(0, 10);
    if (!title || !date)
      continue;
    posts.push({ date, title });
  }
  if (!posts.length)
    return [];
  const newestDate = posts.reduce((max, p) => (p.date > max ? p.date : max), posts[0]!.date);
  return posts.filter(p => p.date === newestDate).map(p => p.title);
}

function firstRssItemTitle(xml: string): string | null {
  const itemMatch = xml.match(/<item\b[\s\S]*?<\/item>/i);
  if (!itemMatch)
    return null;
  const titleMatch = itemMatch[0].match(/<title>([\s\S]*?)<\/title>/i);
  if (!titleMatch)
    return null;
  return titleMatch[1]
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, '\'')
    .trim();
}

test.describe('RSS feed', () => {
  test('/feed.xml is RSS 2.0 with newest published post first', { tag: '@smoke' }, async ({ request, page }) => {
    const res = await request.get('/feed.xml');
    expect(res.status()).toBe(200);

    const contentType = res.headers()['content-type'] ?? '';
    expect(contentType, `content-type was "${contentType}"`).toMatch(/xml/i);

    const body = await res.text();

    // Browser DOMParser rejects truncated/malformed XML that regex fragment checks miss.
    const parsed = await page.evaluate((xml) => {
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const err = doc.querySelector('parsererror')?.textContent ?? null;
      if (err)
        return { ok: false as const, error: err };

      const rss = doc.querySelector('rss');
      const channel = rss?.querySelector(':scope > channel') ?? null;
      const item = channel?.querySelector(':scope > item') ?? null;
      const channelTitle = channel?.querySelector(':scope > title')?.textContent?.trim() ?? null;
      const firstItemTitle = item?.querySelector(':scope > title')?.textContent?.trim() ?? null;

      return {
        ok: true as const,
        version: rss?.getAttribute('version') ?? null,
        hasChannel: !!channel,
        hasChannelTitle: !!channelTitle,
        hasItem: !!item,
        firstItemTitle
      };
    }, body);

    expect(parsed.ok, `feed.xml must be well-formed XML: ${'error' in parsed ? parsed.error : ''}`).toBe(true);
    if (!parsed.ok)
      return;

    expect(parsed.version).toBe('2.0');
    expect(parsed.hasChannel).toBe(true);
    expect(parsed.hasChannelTitle).toBe(true);
    expect(parsed.hasItem).toBe(true);

    const firstTitle = parsed.firstItemTitle || firstRssItemTitle(body);
    expect(firstTitle, 'feed should have a first <item><title>').toBeTruthy();

    const expectedTitles = newestPublishedBlogTitles();
    if (!isEndform && expectedTitles.length > 0) {
      expect(
        expectedTitles,
        `first feed item "${firstTitle}" should be a post with the newest content date`
      ).toContain(firstTitle);
    }
  });
});
