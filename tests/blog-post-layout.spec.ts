import { expect, test } from './fixtures';

const VIDEO_POST = '/blog/webmcp-on-my-site';
const VIDEO_ID = 'AS6k-1uFp-0';
const NON_VIDEO_POST = '/blog/testing-color-mode';
const COVER_POST = '/blog/grok-bot-50th-birthday-photo-video';

test.describe('Blog post layout (cover + companion video)', () => {
  test('posts no longer show an in-article cover image', async ({ page }) => {
    await page.goto(COVER_POST);

    // Cover was previously the NuxtImg under the title with the post title as alt.
    await expect(page.locator('article img[alt*="50th birthday"]')).toHaveCount(0);
  });

  test('video posts expose jump link, section, and a single embed', async ({ page }) => {
    await page.goto(VIDEO_POST);

    const jump = page.getByRole('link', { name: 'Prefer to watch? Jump to the video' });
    await expect(jump).toBeVisible();
    await expect(jump).toHaveAttribute('href', '#watch-the-video');

    const section = page.locator('#watch-the-video');
    await expect(section).toBeVisible();
    await expect(section.getByRole('heading', { name: 'Watch the video', level: 2 })).toBeVisible();
    await expect(section.getByText('The same walkthrough on video, if you would rather see it in action.')).toBeVisible();

    const embeds = page.locator('lite-youtube');
    await expect(embeds).toHaveCount(1);
    await expect(embeds.first()).toHaveAttribute('videoid', VIDEO_ID);
    await expect(section.locator('lite-youtube')).toHaveCount(1);

    const youtubeLink = section.getByRole('link', { name: 'Watch on YouTube' });
    await expect(youtubeLink).toHaveAttribute('href', `https://www.youtube.com/watch?v=${VIDEO_ID}`);

    // Jump target resolves to the section (same document fragment).
    await jump.click();
    await expect(section).toBeInViewport();
  });

  test('non-video posts have neither the jump link nor the video section', async ({ page }) => {
    await page.goto(NON_VIDEO_POST);

    await expect(page.getByRole('link', { name: 'Prefer to watch? Jump to the video' })).toHaveCount(0);
    await expect(page.locator('#watch-the-video')).toHaveCount(0);
    await expect(page.locator('lite-youtube')).toHaveCount(0);
  });

  test('og:image meta remains present without an in-article cover', async ({ page }) => {
    await page.goto(COVER_POST);

    const ogImage = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(ogImage).toMatch(/^https:\/\//);
    expect(ogImage).toContain('grok-bot-50th-birthday-photo-video');
    await expect(page.locator('article img[alt*="50th birthday"]')).toHaveCount(0);
  });
});
