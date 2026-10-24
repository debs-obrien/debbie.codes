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

test('desktop: background video is added after load, muted, looping and inline', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  const video = hero(page).getByTestId('hero-video');
  await expect(video).toBeAttached({ timeout: 10_000 });
  await expect(video).toHaveAttribute('loop', '');
  await expect(video).toHaveAttribute('playsinline', '');
  await expect(video).toHaveAttribute('preload', 'none');
  expect(await video.evaluate((v: HTMLVideoElement) => v.muted)).toBe(true);
  await expect(video.locator('source')).toHaveCount(2);
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
    // Give the idle callback time to run, then confirm nothing was added.
    await page.waitForTimeout(2500);
    await expect(hero(page).getByTestId('hero-video')).toHaveCount(0);
    expect(videoRequests).toEqual([]);
  });
});

test.describe('small screen', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('poster only, no video', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' });
    await expect(hero(page).getByTestId('hero-poster')).toBeVisible();
    await page.waitForTimeout(2500);
    await expect(hero(page).getByTestId('hero-video')).toHaveCount(0);
  });
});
