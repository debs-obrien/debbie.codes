import { DEFAULT_OG_IMAGE, resolveOgImage } from '../utils/og-image';
import { expect, test } from './fixtures';

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
    const headerCover = page.locator('article img[alt*="50th birthday"]').first();
    await expect(headerCover).toBeVisible();
    await expect(headerCover).toHaveAttribute('src', /grok-bot-50th-birthday-photo-video/);
  });
});
