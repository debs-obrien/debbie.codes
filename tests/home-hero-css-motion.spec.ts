import { expect, test } from './fixtures';

function motion(page: import('@playwright/test').Page) {
  return page.getByRole('region', { name: 'Introduction' }).getByTestId('hero-css-motion');
}

function heroAnimations(page: import('@playwright/test').Page) {
  return motion(page).evaluate((el: Element) =>
    el.getAnimations({ subtree: true }).map((a) => {
      const t = a.effect?.getComputedTiming();
      return { duration: Number(t?.duration), iterations: t?.iterations, delay: Number(t?.delay) };
    })
  );
}

test.describe('desktop', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('hero background is CSS-only, plays once and finishes within 5 s', async ({ page }) => {
    await page.goto('/');
    await expect(motion(page)).toBeAttached();
    await expect(page.getByRole('region', { name: 'Introduction' }).locator('video')).toHaveCount(0);
    await expect(motion(page).locator('img')).toHaveCount(0);
    const animations = await heroAnimations(page);
    expect(animations.length).toBeGreaterThan(0);
    // Every hero background animation plays once and is done within 5 s (WCAG 2.2.2).
    for (const a of animations) {
      expect(a.iterations).toBe(1);
      expect(a.delay + a.duration).toBeLessThanOrEqual(5000);
    }
    // Real HTML text stays on top.
    await expect(page.getByRole('heading', { level: 1, name: /Debbie O'Brien/i })).toBeVisible();
  });
});

test.describe('reduced motion', () => {
  test.use({ viewport: { width: 1280, height: 800 } });

  test('no hero background animation runs', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    await expect(motion(page)).toBeAttached();
    expect(await heroAnimations(page)).toEqual([]);
  });
});
