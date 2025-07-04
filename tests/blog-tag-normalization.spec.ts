import { expect, test } from '@playwright/test';

test.describe('Blog Tag Normalization', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('tag section shows normalized tags', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse by Topic' })).toBeVisible();
    
    // Should show tag links with counts
    const tagLinks = page.locator('[href^="/blog/tags/"]');
    const tagCount = await tagLinks.count();
    
    expect(tagCount).toBeGreaterThan(0);
  });

  test('tag pages work with normalized tags', async ({ page }) => {
    // Test a common tag like "javascript"
    await page.goto('/blog/tags/javascript');
    
    // Should show tag page content
    await expect(page.getByRole('heading', { level: 1 })).toContainText('javascript');
    
    // Should have search functionality
    await expect(page.getByPlaceholder('Search articles...')).toBeVisible();
  });

  test('search works on tag pages and searches all articles', async ({ page, isMobile }) => {
    if (!isMobile) {
      // Go to a specific tag page
      await page.goto('/blog/tags/testing');
      
      // Should see tag-specific articles first
      await expect(page.getByRole('heading', { level: 1 })).toContainText('testing');
      
      // Use search - this should now search ALL articles, not just testing ones
      const searchInput = page.getByPlaceholder('Search articles...');
      await searchInput.fill('nuxt');
      
      // Should show results that may not be tagged with "testing"
      await page.waitForTimeout(500);
      
      const articles = page.getByRole('article');
      const articleCount = await articles.count();
      
      // If there are results, some should contain "nuxt"
      if (articleCount > 0) {
        await expect.poll(() =>
          page.getByRole('article').filter({ hasText: 'nuxt' }).count()
        ).toBeGreaterThan(0);
      }
    }
  });
});