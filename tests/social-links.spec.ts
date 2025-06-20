import { test, expect } from '@playwright/test';

test.describe('Social Links', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });
  test('x link in header works', async ({ page }) => {
    await page.context().route('https://x.com/**', route => route.fulfill({
      body: '<html><body><h1>X</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('banner').getByRole('link', { name: 'x' }).click()
    ]);
    await expect(page1).toHaveURL('https://x.com/debs_obrien');
  });

  test('youtube link in header works', async ({ page }) => {
    await page.context().route('https://www.youtube.com/**', route => route.fulfill({
      body: '<html><body><h1>YouTube</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('banner').getByRole('link', { name: 'youTube' }).click()
    ]);
    await expect(page1).toHaveURL('https://www.youtube.com/c/DebbieOBrien');
  });
});

