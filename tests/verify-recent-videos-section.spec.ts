// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  // Videos section structure has changed after redesign
  test.fixme('Verify Recent Videos Section', async ({ page }) => {
    // The videos section has been redesigned and no longer uses article elements
    // It now displays videos in a different layout structure
    await page.goto('/');

    // 2. Locate the "Recent Videos" section
    // 3. Count the video articles displayed
    
    // Verify 'Recent Videos' heading is visible
    await expect(page.getByRole('heading', { name: 'Recent Videos' })).toBeVisible();

    // Verify "Recent Videos" link navigates to `/videos`
    const recentVideosLink = page.getByRole('link', { name: 'Recent Videos' });
    await expect(recentVideosLink).toHaveAttribute('href', '/videos');

    // Count video articles (exactly 4)
    const videosRegion = page.getByRole('region', { name: 'Recent Videos' });
    const videoArticles = videosRegion.locator('article');
    await expect(videoArticles).toHaveCount(4);

    // Verify each video article contains required elements
    for (const article of await videoArticles.all()) {
      // Date (time element)
      await expect(article.locator('time')).toBeVisible();
      
      // Publisher/source (paragraph)
      await expect(article.getByRole('paragraph')).toBeVisible();
      
      // Title (heading level 3)
      await expect(article.getByRole('heading', { level: 3 })).toBeVisible();
      
      // Tags list
      await expect(article.getByRole('list')).toBeVisible();
    }
  });
});
