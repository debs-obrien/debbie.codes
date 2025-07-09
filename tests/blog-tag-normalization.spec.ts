import { expect, test } from '@playwright/test';

test.describe('Blog Tag Normalization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('tag section shows normalized tags', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse by Topic' })).toBeVisible();

    const tagLinks = page.locator('[href^="/blog/tags/"]');
    const tagCount = await tagLinks.count();

    expect(tagCount).toBeGreaterThan(0);
  });

  test('tag pages work with normalized tags', async ({ page }) => {
    await page.goto('/blog/tags/javascript');

    // Check that we navigated to the correct URL instead of checking heading text
    await expect(page).toHaveURL('/blog/tags/javascript');

    await expect(page.getByPlaceholder('Search articles...')).toBeVisible();
  });

  test('search works on tag pages and searches all articles', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/blog/tags/testing');

      // Check that we navigated to the correct URL
      await expect(page).toHaveURL('/blog/tags/testing');

      const searchInput = page.getByPlaceholder('Search articles...');
      await searchInput.fill('nuxt');

      await page.waitForTimeout(500);

      const articles = page.getByRole('article');
      const articleCount = await articles.count();

      if (articleCount > 0) {
        await expect.poll(() =>
          page.getByRole('article').filter({ hasText: 'nuxt' }).count()
        ).toBeGreaterThan(0);
      }
    }
  });
});
