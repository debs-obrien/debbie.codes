import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { DEFAULT_OG_IMAGE, resolveOgImage } from '../utils/og-image';
import { expect, test } from './fixtures';

const isEndform = process.env.ENDFORM === 'true';
const blogDir = join('content', 'blog');
const SITE_ORIGIN = 'https://debbie.codes';

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match)
    return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

/** Newest + a couple of older published blog slugs from content/blog. */
function sampleBlogSlugs(): string[] {
  if (!existsSync(blogDir))
    return [];

  const posts: { date: string, slug: string }[] = [];
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
    const date = frontmatterValue(block, 'date')?.slice(0, 10);
    if (!date)
      continue;
    posts.push({ date, slug: file.replace(/\.md$/, '') });
  }
  posts.sort((a, b) => b.date.localeCompare(a.date) || a.slug.localeCompare(b.slug));
  if (posts.length < 5)
    return posts.map(p => p.slug);

  // Newest 3 + two older posts (mid archive + near the oldest)
  const newest = posts.slice(0, 3).map(p => p.slug);
  const mid = posts[Math.floor(posts.length / 2)]!.slug;
  const older = posts[Math.floor(posts.length * 0.8)]!.slug;
  return [...new Set([...newest, mid, older])];
}

/** True for local Playwright webServer base URLs (CDN unavailable under nuxt dev). */
function isLocalDevBaseURL(baseURL: string): boolean {
  try {
    const host = new URL(baseURL).hostname;
    return host === '127.0.0.1' || host === 'localhost';
  }
  catch {
    return false;
  }
}

/**
 * Map an absolute OG URL to something the test base URL can serve.
 * Under local `nuxt dev`, Netlify Image CDN (`/.netlify/images`) is unavailable,
 * so we fetch the underlying `/images/...` source instead. On deploy previews /
 * production bases, keep the CDN path so a broken transform still fails.
 * Third-party hosts (e.g. Unsplash) return null — callers skip fetching them.
 */
function fetchableImageUrl(absoluteHttps: string, baseURL: string | undefined): string | null {
  if (/images\.unsplash\.com/i.test(absoluteHttps) || !absoluteHttps.startsWith(SITE_ORIGIN))
    return null;

  if (!baseURL)
    return absoluteHttps;

  const origin = baseURL.replace(/\/$/, '');

  if (absoluteHttps.includes('/.netlify/images') && isLocalDevBaseURL(origin)) {
    try {
      const u = new URL(absoluteHttps);
      const src = u.searchParams.get('url');
      if (src?.startsWith('/'))
        return `${origin}${src}`;
    }
    catch {
      // fall through to host rewrite
    }
  }

  return absoluteHttps.replace(SITE_ORIGIN, origin);
}

test.describe('Blog OG / Twitter images', () => {
  test('posts without a cover image fall back to the site default card', () => {
    // Every blog post has a cover now, so check the fallback in resolveOgImage directly.
    expect(resolveOgImage('', undefined)).toBe(DEFAULT_OG_IMAGE);
    expect(resolveOgImage(null, '  ')).toBe(DEFAULT_OG_IMAGE);
  });

  test('posts with ogImage frontmatter emit an absolute https URL', async ({ page }) => {
    await page.goto('/blog/work-life-balance');

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

    expect(ogImage).toMatch(/^https:\/\//);
    expect(twitterImage).toMatch(/^https:\/\//);
    expect(ogImage).not.toBe(DEFAULT_OG_IMAGE);
    expect(ogImage).not.toMatch(/res\.cloudinary\.com/);
    expect(ogImage).toContain('devs-in-the-forest');
    expect(ogImage).toMatch(/\/.netlify\/images\?/);
    await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute('content', '1200');
    await expect(page.locator('meta[property="og:image:height"]')).toHaveAttribute('content', '630');
  });

  test('Grok Bot 50th birthday post uses its local share image and shows a header cover', async ({ page }) => {
    await page.goto('/blog/grok-bot-50th-birthday-photo-video');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https:\/\/debbie\.codes\/\.netlify\/images\?/);
    expect(ogImage).toContain('grok-bot-50th-birthday-photo-video');
    expect(ogImage).not.toMatch(/res\.cloudinary\.com/);
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', ogImage!);
    // image frontmatter also drives the in-article cover below the title (ogImage alone does not)
    const headerCover = page.locator('article img[alt*="50th birthday"]').first();
    await expect(headerCover).toBeVisible();
    await expect(headerCover).toHaveAttribute('src', /grok-bot-50th-birthday-photo-video/);
  });

  test('sampled posts expose absolute og:image and twitter:image that resolve', async ({ page, request, baseURL }) => {
    const slugs = sampleBlogSlugs();
    test.skip(
      isEndform || slugs.length === 0,
      'content/blog is not available on Endform runners (no repo checkout)'
    );

    for (const slug of slugs) {
      await page.goto(`/blog/${slug}`);

      const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
      const twitterImage = await page.locator('meta[name="twitter:image"]').getAttribute('content');

      expect(ogImage, `${slug} og:image`).toMatch(/^https:\/\//);
      expect(twitterImage, `${slug} twitter:image`).toMatch(/^https:\/\//);
      expect(ogImage, `${slug} og:image empty`).toBeTruthy();
      expect(twitterImage, `${slug} twitter:image empty`).toBeTruthy();
      expect(ogImage, `${slug} og:image must not use Cloudinary`).not.toMatch(/res\.cloudinary\.com/);
      expect(twitterImage, `${slug} twitter:image must not use Cloudinary`).not.toMatch(/res\.cloudinary\.com/);

      for (const url of [ogImage!, twitterImage!]) {
        const fetchUrl = fetchableImageUrl(url, baseURL);
        if (!fetchUrl) {
          // External host (e.g. Unsplash) — shape assertion only; no third-party fetch.
          continue;
        }
        const imageResponse = await request.get(fetchUrl);
        expect(imageResponse.status(), `${slug} ${fetchUrl} should return 200`).toBe(200);
        expect(
          imageResponse.headers()['content-type'] ?? '',
          `${slug} ${fetchUrl} should be an image`
        ).toMatch(/image\//i);
      }
    }
  });
});
