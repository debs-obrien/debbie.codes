// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Recent Blog Posts Section', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('http://localhost:3020/');

    // 2. Locate the "Recent Blog Posts" region
    // 3. Count the blog post articles
    
    // Verify 'Recent Blog Posts' heading is visible
    await expect(page.getByRole('heading', { name: 'Recent Blog Posts' })).toBeVisible();

    // Verify link navigates to `/blog`
    const recentBlogLink = page.getByRole('link', { name: 'Recent Blog Posts' });
    await expect(recentBlogLink).toHaveAttribute('href', '/blog');

    // Count blog post articles (exactly 6)
    const blogRegion = page.getByRole('region', { name: 'Recent Blog Posts' });
    const blogArticles = blogRegion.locator('article');
    await expect(blogArticles).toHaveCount(6);

    // Verify each article contains required elements
    for (const article of await blogArticles.all()) {
      // Title (heading level 3)
      await expect(article.getByRole('heading', { level: 3 })).toBeVisible();
      
      // Date (time element)
      await expect(article.locator('time')).toBeVisible();
      
      // Read time
      await expect(article.getByText(/min read/i)).toBeVisible();
      
      // Tags list
      await expect(article.getByRole('list')).toBeVisible();
    }
  });
});
