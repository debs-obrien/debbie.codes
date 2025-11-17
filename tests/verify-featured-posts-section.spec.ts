// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Featured Posts Section', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('http://localhost:3020/');

    // 2. Scroll to the "Featured Posts" section
    // 3. Count the number of featured articles displayed
    
    // Verify 'Featured Posts' heading (level 2) is visible
    await expect(page.getByRole('heading', { name: 'Featured Posts' })).toBeVisible();

    // Count the number of featured articles (exactly 2)
    const featuredPostsSection = page.getByLabel('Featured Posts');
    const articles = featuredPostsSection.locator('article');
    await expect(articles).toHaveCount(2);

    // Verify each featured post contains required elements
    for (const article of await articles.all()) {
      // Tags list
      await expect(article.locator('list').first()).toBeVisible();
      
      // Title link
      const titleLink = article.getByRole('link').first();
      await expect(titleLink).toBeVisible();
      
      // Description/excerpt paragraph
      await expect(article.locator('paragraph').first()).toBeVisible();
      
      // "Read more" link
      await expect(article.getByRole('link', { name: /read more/i })).toBeVisible();
    }
  });
});
