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

/**
 * Map an absolute OG URL to something the test base URL can serve.
 * Same-origin `/images/...` and `/.netlify/images` rewrite to the preview origin.
 * Cloudinary / Unsplash stay external — Playwright fixtures block Cloudinary
 * bandwidth (#686), so those return null (shape-only assertions).
 */
function fetchableImageUrl(absoluteHttps: string, baseURL: string | undefined): string | null {
  if (
    /images\.unsplash\.com/i.test(absoluteHttps)
    || /res\.cloudinary\.com/i.test(absoluteHttps)
    || !absoluteHttps.startsWith(SITE_ORIGIN)
  ) {
    return null;
  }

  if (!baseURL)
    return absoluteHttps;

  const origin = baseURL.replace(/\/$/, '');

  if (absoluteHttps.includes('/.netlify/images')) {
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

/** Dual-host + external: Netlify CDN, Cloudinary, Unsplash, or static /images. */
function expectValidOgShape(ogImage: string, label: string) {
  expect(ogImage, label).toMatch(/^https:\/\//);
  if (/res\.cloudinary\.com/i.test(ogImage)) {
    expect(ogImage, `${label} Cloudinary size`).toMatch(/w_1200/);
    expect(ogImage, `${label} Cloudinary size`).toMatch(/h_630/);
    expect(ogImage, `${label} Cloudinary JPEG`).toMatch(/f_jpg/);
    expect(ogImage, `${label} must not mix Netlify CDN`).not.toMatch(/\/.netlify\/images/);
    return 'cloudinary';
  }
  if (/\/.netlify\/images/i.test(ogImage)) {
    expect(ogImage, `${label} Netlify w`).toMatch(/[?&]w=1200\b/);
    expect(ogImage, `${label} Netlify h`).toMatch(/[?&]h=630\b/);
    expect(ogImage, `${label} must not mix Cloudinary`).not.toMatch(/res\.cloudinary\.com/);
    return 'netlify';
  }
  if (/images\.unsplash\.com/i.test(ogImage)) {
    expect(ogImage, `${label} Unsplash w`).toMatch(/[?&]w=1200\b/);
    expect(ogImage, `${label} Unsplash h`).toMatch(/[?&]h=630\b/);
    return 'unsplash';
  }
  expect(ogImage, `${label} static fallback`).toMatch(/^https:\/\/debbie\.codes\/(?:images\/|x-card)/);
  return 'static';
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

    expect(ogImage).toBeTruthy();
    expect(twitterImage).toBeTruthy();
    expect(ogImage).not.toBe(DEFAULT_OG_IMAGE);
    expect(ogImage).toContain('devs-in-the-forest');
    const kind = expectValidOgShape(ogImage!, 'work-life-balance og:image');
    expectValidOgShape(twitterImage!, 'work-life-balance twitter:image');
    // Cloudinary OG is sized 1200×630; Netlify CDN likewise; static /images is not.
    if (kind === 'static') {
      await expect(page.locator('meta[property="og:image:width"]')).toHaveCount(0);
      await expect(page.locator('meta[property="og:image:height"]')).toHaveCount(0);
    }
  });

  test('Grok Bot 50th birthday post uses its share image without an in-article cover', async ({ page }) => {
    await page.goto('/blog/grok-bot-50th-birthday-photo-video');
    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toBeTruthy();
    expect(ogImage).toContain('grok-bot-50th-birthday-photo-video');
    expectValidOgShape(ogImage!, 'grok-bot-50th og:image');
    await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', ogImage!);
    // image/ogImage frontmatter still drive social meta; the in-article cover is gone.
    await expect(page.locator('article img[alt*="50th birthday"]')).toHaveCount(0);
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

      expect(ogImage, `${slug} og:image empty`).toBeTruthy();
      expect(twitterImage, `${slug} twitter:image empty`).toBeTruthy();
      expectValidOgShape(ogImage!, `${slug} og:image`);
      expectValidOgShape(twitterImage!, `${slug} twitter:image`);

      for (const url of [ogImage!, twitterImage!]) {
        const fetchUrl = fetchableImageUrl(url, baseURL);
        if (!fetchUrl) {
          // External host (Unsplash / Cloudinary) — shape only; no Cloudinary crawl (#686).
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
