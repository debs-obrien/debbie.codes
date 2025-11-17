// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Featured Posts Section', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('http://localhost:3020/');

    // 2. Scroll to the "Featured Posts" section
    // 3. Count the number of featured articles displayed
    
        // Verify we have exactly 2 articles and validate structure
    const featuredSection = page.getByRole('heading', { name: 'Featured Posts' }).locator('+ *');
    const articles = featuredSection.locator('article');
    await expect(articles).toHaveCount(2);
    
    // Check first article structure
    const firstArticle = articles.first();
    await expect(firstArticle.getByRole('list')).toBeVisible();
    await expect(firstArticle.getByRole('link').first()).toBeVisible();
    await expect(firstArticle.getByRole('paragraph')).toBeVisible();
    await expect(firstArticle.getByRole('link').last()).toBeVisible();
    
    // Check second article structure
    const secondArticle = articles.last();
    await expect(secondArticle.getByRole('list')).toBeVisible();
    await expect(secondArticle.getByRole('link').first()).toBeVisible();
    await expect(secondArticle.getByRole('paragraph')).toBeVisible();
    await expect(secondArticle.getByRole('link').last()).toBeVisible();
  });
});
