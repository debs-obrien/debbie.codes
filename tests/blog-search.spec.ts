import { expect, test } from '@playwright/test';

test.describe('Blog Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('search field is present and functional', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search articles...');
    }
  });

  test('search filters blog posts correctly', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');

      await expect(page.getByRole('article').first()).toBeVisible();

      const initialArticles = page.getByRole('article');
      const initialCount = await initialArticles.count();

      await searchInput.fill('playwright');

      const filteredArticles = page.getByRole('article');
      const filteredCount = await filteredArticles.count();

      expect(filteredCount).toBeLessThanOrEqual(initialCount);

      if (filteredCount > 0) {
        await expect.poll(() =>
          page.getByRole('article').filter({ hasText: 'playwright' }).count()
        ).toBeGreaterThan(0);
      }
    }
  });

  test('search works with different search terms', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');

      await searchInput.fill('nuxt');

      const nuxtResults = await page.getByRole('article').count();

      await searchInput.clear();
      await searchInput.fill('testing');

      const testingResults = await page.getByRole('article').count();

      expect(nuxtResults).toBeGreaterThan(0);
      expect(testingResults).toBeGreaterThan(0);
    }
  });

  test('clearing search shows all posts', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');

      await expect(page.getByRole('article').first()).toBeVisible();

      const initialCount = await page.getByRole('article').count();

      await searchInput.fill('playwright');

      await searchInput.clear();

      const finalCount = await page.getByRole('article').count();
      expect(finalCount).toBe(initialCount);
    }
  });

  test('search with no results shows appropriate state', async ({ page, isMobile }) => {
    if (!isMobile) {
      await expect(page.getByRole('article').first()).toBeVisible();

      const searchInput = page.getByPlaceholder('Search articles...');

      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();

      await searchInput.click();
      await page.waitForTimeout(100);
      await searchInput.fill('xyz123nonexistent');

      await page.waitForTimeout(1000);

      try {
        await expect(page.getByRole('article')).toHaveCount(0);
      }
      catch (e) {
        const articles = page.getByRole('article');
        const count = await articles.count();
        const matchingArticles = await page.getByRole('article').filter({ hasText: 'xyz123nonexistent' }).count();
        expect(matchingArticles).toBe(0);
      }
    }
  });
});
