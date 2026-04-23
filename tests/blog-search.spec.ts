import { expect, test } from '@playwright/test';

/**
 * Helper: fill the search input and wait for Vue search to activate.
 * Nuxt SSR hydration may not be complete when the input first appears,
 * so we retry fill + verify until the "Search Results" heading is visible.
 */
async function searchFor(page: import('@playwright/test').Page, term: string) {
  const searchInput = page.getByPlaceholder('Search...');
  await expect(async () => {
    await searchInput.fill(term);
    await expect(page.getByRole('heading', { name: /Search Results/ })).toBeVisible();
  }).toPass({ timeout: 10_000 });
}

test.describe('Blog Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('article').first()).toBeVisible();
  });

  test('search field is present and functional', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search...');
      await expect(searchInput).toBeVisible();
      await expect(searchInput).toHaveAttribute('placeholder', 'Search...');
    }
  });

  test('search filters blog posts correctly', async ({ page, isMobile }) => {
    if (!isMobile) {
      const articles = page.getByRole('article');
      const firstArticle = articles.first();
      const firstArticleTitle = await firstArticle.getByRole('link').first().innerText();

      await searchFor(page, firstArticleTitle);
      await expect(articles.filter({ hasText: firstArticleTitle })).not.toHaveCount(0);
    }
  });

  test('search works with different search terms', async ({ page, isMobile }) => {
    if (!isMobile) {
      await searchFor(page, 'nuxt');
      await expect(page.getByRole('article').first()).toBeVisible();

      await searchFor(page, 'testing');
      await expect(page.getByRole('article').first()).toBeVisible();
    }
  });

  test('clearing search shows all posts', async ({ page, isMobile }) => {
    if (!isMobile) {
      const initialCount = await page.getByRole('article').count();

      await searchFor(page, 'playwright');

      const searchInput = page.getByPlaceholder('Search...');
      await searchInput.clear();
      await expect(page.getByRole('heading', { name: 'Recent Posts' })).toBeVisible();
      await expect(page.getByRole('article')).toHaveCount(initialCount);
    }
  });

  test('search with no results shows appropriate state', async ({ page, isMobile }) => {
    if (!isMobile) {
      const searchInput = page.getByPlaceholder('Search...');

      // Use searchFor with a term that matches nothing — heading should show "Search Results (0)"
      await expect(async () => {
        await searchInput.fill('xyz123nonexistent');
        await expect(page.getByRole('heading', { name: /Search Results \(0\)/ })).toBeVisible();
      }).toPass({ timeout: 10_000 });

      await expect(page.getByRole('article')).toHaveCount(0);
    }
  });
});
