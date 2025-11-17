// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Recent Podcasts Section', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('http://localhost:3020/');

    // 2. Locate the "Recent Podcasts" region
    // 3. Count the podcast articles
    
    // Verify 'Recent Podcasts' heading is visible
    await expect(page.getByRole('heading', { name: 'Recent Podcasts' })).toBeVisible();

    // Verify link navigates to `/podcasts`
    const recentPodcastsLink = page.getByRole('link', { name: 'Recent Podcasts' });
    await expect(recentPodcastsLink).toHaveAttribute('href', '/podcasts');

    // Count podcast articles (exactly 3)
    const podcastsRegion = page.getByRole('region', { name: 'Recent Podcasts' });
    const podcastArticles = podcastsRegion.locator('article');
    await expect(podcastArticles).toHaveCount(3);

    // Verify each podcast contains required elements
    for (const article of await podcastArticles.all()) {
      // Image/thumbnail
      await expect(article.locator('img')).toBeVisible();
      
      // Title (heading level 3)
      await expect(article.getByRole('heading', { level: 3 })).toBeVisible();
      
      // Date (time element)
      await expect(article.locator('time')).toBeVisible();
      
      // Tags list
      await expect(article.getByRole('list')).toBeVisible();
    }
  });
});
