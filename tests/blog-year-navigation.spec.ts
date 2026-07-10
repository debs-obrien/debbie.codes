import { expect, test } from '@playwright/test';

test.describe('Blog Year Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('year navigation section is visible', async ({ page }) => {
    // Year links should be visible in the filter section
    await expect(page.getByRole('link', { name: '2024' })).toBeVisible();
    await expect(page.getByRole('link', { name: '2025' })).toBeVisible();
  });

  test('year links navigate to correct year pages', async ({ page }) => {
    const yearLinks = page.getByRole('link').filter({ hasText: /^\d{4}$/ });
    const yearCount = await yearLinks.count();

    if (yearCount > 0) {
      const firstYearLink = yearLinks.first();
      const yearText = await firstYearLink.textContent();

      // Retry the click until navigation happens. On a cold page load (fresh
      // Endform runner) a click can fire before Nuxt hydration attaches the SPA
      // router, silently leaving us on /blog.
      await expect(async () => {
        await firstYearLink.click();
        await expect(page).toHaveURL(new RegExp(`/blog/year/${yearText?.trim()}/?$`), { timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await expect(page.getByRole('heading', { name: yearText?.trim(), level: 1 })).toBeVisible();
    }
  });

  test('year page shows filtered posts', async ({ page }) => {
    await page.goto('/blog/year/2024');

    await expect(page.getByRole('heading', { name: '2024', level: 1 })).toBeVisible();

    // Verify that articles are shown for the year. Poll rather than a one-shot
    // count(): on a cold load articles hydrate progressively, so an immediate
    // read can catch an empty list.
    await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
  });
});
