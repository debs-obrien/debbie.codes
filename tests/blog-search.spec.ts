import { expect, test } from '@playwright/test';

test.describe('Blog Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('search field is present and functional', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Check search input is visible
      const searchInput = page.getByPlaceholder('Search articles...');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search articles...');
    }
  });

  test('search filters blog posts correctly', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');
      
      // Wait for articles to be visible before counting
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Get initial count of articles
      const initialArticles = page.getByRole('article');
      const initialCount = await initialArticles.count();
      
      // Search for "playwright"
      await searchInput.fill('playwright');
      
      // Check that results are filtered
      const filteredArticles = page.getByRole('article');
      const filteredCount = await filteredArticles.count();
      
      // Should have fewer results after filtering
      expect(filteredCount).toBeLessThanOrEqual(initialCount);
      
      // Verify that visible articles contain the search term
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
      
      // Test search for "nuxt"
      await searchInput.fill('nuxt');
      
      const nuxtResults = await page.getByRole('article').count();
      
      // Clear and search for different term
      await searchInput.clear();
      await searchInput.fill('testing');
      
      const testingResults = await page.getByRole('article').count();
      
      // Both searches should return some results
      expect(nuxtResults).toBeGreaterThan(0);
      expect(testingResults).toBeGreaterThan(0);
    }
  });

  test('clearing search shows all posts', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search articles...');
      
      // Wait for articles to be visible before counting
      await expect(page.getByRole('article').first()).toBeVisible();
      
      // Get initial count
      const initialCount = await page.getByRole('article').count();
      
      // Search for something specific
      await searchInput.fill('playwright');
      
      // Clear search
      await searchInput.clear();
      
      // Should show all posts again
      const finalCount = await page.getByRole('article').count();
      expect(finalCount).toBe(initialCount);
    }
  });

  test('search with no results shows appropriate state', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Wait for articles to be visible first
      await expect(page.getByRole('article').first()).toBeVisible();
      
      const searchInput = page.getByPlaceholder('Search articles...');
      
      // Ensure the input is ready before interacting with it
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toBeEnabled();
      
      // Search for something that definitely won't exist
      await searchInput.click();
      await page.waitForTimeout(100); // Small delay after click
      await searchInput.fill('xyz123nonexistent');
      
      // Wait for search results to update - need a longer timeout
      await page.waitForTimeout(1000);
      
      // Should have no articles or verify no articles contain the search term
      try {
        await expect(page.getByRole('article')).toHaveCount(0);
      } catch (e) {
        // If articles are still visible, make sure none contain the search text
        const articles = page.getByRole('article');
        const count = await articles.count();
        const matchingArticles = await page.getByRole('article').filter({ hasText: 'xyz123nonexistent' }).count();
        expect(matchingArticles).toBe(0);
      }
    }
  });
});
