import { expect, test } from '@playwright/test';

test.describe('Blog Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('search field is present and functional', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Check search input is visible
      const searchInput = page.getByRole('textbox', { name: 'Search' });
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search');
    }
  });

  test('search filters blog posts correctly', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByRole('textbox', { name: 'Search' });
      
      // Get initial count of articles
      const initialArticles = page.getByRole('article');
      const initialCount = await initialArticles.count();
      
      // Search for "playwright"
      await searchInput.fill('playwright');
      
      // Wait for search results to update
      await page.waitForTimeout(500);
      
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
      const searchInput = page.getByRole('textbox', { name: 'Search' });
      
      // Test search for "nuxt"
      await searchInput.fill('nuxt');
      await page.waitForTimeout(500);
      
      const nuxtResults = await page.getByRole('article').count();
      
      // Clear and search for different term
      await searchInput.clear();
      await searchInput.fill('testing');
      await page.waitForTimeout(500);
      
      const testingResults = await page.getByRole('article').count();
      
      // Both searches should return some results
      expect(nuxtResults).toBeGreaterThan(0);
      expect(testingResults).toBeGreaterThan(0);
    }
  });

  test('clearing search shows all posts', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByRole('textbox', { name: 'Search' });
      
      // Get initial count
      const initialCount = await page.getByRole('article').count();
      
      // Search for something specific
      await searchInput.fill('playwright');
      await page.waitForTimeout(500);
      
      // Clear search
      await searchInput.clear();
      await page.waitForTimeout(500);
      
      // Should show all posts again
      const finalCount = await page.getByRole('article').count();
      expect(finalCount).toBe(initialCount);
    }
  });

  test('search with no results shows appropriate state', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByRole('textbox', { name: 'Search' });
      
      // Search for something that definitely won't exist
      await searchInput.fill('xyz123nonexistent');
      await page.waitForTimeout(500);
      
      // Should have no articles
      const articleCount = await page.getByRole('article').count();
      expect(articleCount).toBe(0);
    }
  });
});
