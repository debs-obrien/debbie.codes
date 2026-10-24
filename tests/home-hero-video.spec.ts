import { expect, test } from '@playwright/test';

const hero = (page: import('@playwright/test').Page) => page.getByRole('region', { name: 'Introduction' });

test('hero poster is an eager, high-priority image with fixed size', async ({ page }) => {
  await page.goto('/');
  const poster = hero(page).getByTestId('hero-poster');
  await expect(poster).toHaveAttribute('loading', 'eager');
  await expect(poster).toHaveAttribute('fetchpriority', 'high');
  await expect(poster).toHaveAttribute('width', '1280');
  await expect(poster).toHaveAttribute('height', '720');
  await expect.poll(() => poster.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth)).toBeGreaterThan(0);
});

test('desktop: background video is added after load, muted, inline and plays once', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const video = hero(page).getByTestId('hero-video');
  await expect(video).toBeAttached({ timeout: 10_000 });
  await expect(video).not.toHaveAttribute('loop');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('preload', 'none');
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await expect(video.locator('source')).toHaveCount(2);
  // No pause control: the motion is 5 s or less (WCAG 2.2.2).
  await expect(hero(page).getByRole('button', { name: /background video/i })).toHaveCount(0);
  // Plays once: it reaches the end and stays there.
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.duration), { timeout: 10_000 }).toBeLessThanOrEqual(5);
  await expect.poll(() => video.evaluate((v: HTMLVideoElement) => v.ended), { timeout: 15_000 }).toBe(true);
});

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('no video element or video request', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const videoRequests: string[] = [];
    page.on('request', (req) => {
      if (/\/images\/hero\/.*\.(?:webm|mp4)/.test(req.url()))
        videoRequests.push(req.url());
    });
    await page.goto('/', { waitUntil: 'load' });
    await expect(hero(page).getByTestId('hero-poster')).toBeVisible();
    // Wait for the hero's after-load gate to decide, then confirm nothing was added.
    await expect(hero(page)).toHaveAttribute('data-hero-video', 'off', { timeout: 10_000 });
    await expect(hero(page).getByTestId('hero-video')).toHaveCount(0);
    expect(videoRequests).toEqual([]);
  });
});

test.describe('small screen', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('poster only, no video', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(hero(page).getByTestId('hero-poster')).toBeVisible();
    await expect(hero(page)).toHaveAttribute('data-hero-video', 'off', { timeout: 10_000 });
    await expect(hero(page).getByTestId('hero-video')).toHaveCount(0);
  });
});
