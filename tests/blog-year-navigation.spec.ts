import { expect, test } from '@playwright/test';

test.describe('Blog Year Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('year navigation section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse by Year' })).toBeVisible();
  });

  test('year links navigate to correct year pages', async ({ page }) => {
    const yearLinks = page.getByRole('link').filter({ hasText: /^\d{4}$/ });
    const yearCount = await yearLinks.count();

    if (yearCount > 0) {
      const firstYearLink = yearLinks.first();
      const yearText = await firstYearLink.textContent();

      await firstYearLink.click();

      await expect(page).toHaveURL(`/blog/year/${yearText?.trim()}`);

      await expect(page.getByRole('heading', { name: `Blog Posts from ${yearText?.trim()}`, level: 1 })).toBeVisible();
    }
  });

  test('year page shows filtered posts', async ({ page }) => {
    await page.goto('/blog/year/2024');

    await expect(page.getByRole('heading', { name: 'Blog Posts from 2024', level: 1 })).toBeVisible();

    await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
  });
});
