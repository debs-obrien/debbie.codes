// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Featured Podcast Section', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. Locate the "Featured Podcast" section
    // 3. Verify podcast details
    
    // Verify 'Featured Podcast' heading (level 2) is visible
    await expect(page.getByRole('heading', { name: 'Featured Podcast', level: 2 })).toBeVisible();

    // Locate the Featured Podcast article
    const featuredPodcastArticle = page.getByRole('article', { name: 'Featured Podcast' });
    await expect(featuredPodcastArticle).toBeVisible();

    // Verify podcast title is displayed
    await expect(featuredPodcastArticle.locator('p').getByText('Changing Testing using Playwright MCP with Debbie O\'Brien')).toBeVisible();

    // Verify 'Listen Now' link with external URL
    const listenNowLink = page.getByRole('link', { name: 'Listen Now' });
    await expect(listenNowLink).toBeVisible();
    await expect(listenNowLink).toHaveAttribute('href', 'https://www.dotnetrocks.com/details/1954');

    // Verify podcast image is present in the Listen Now link
    await expect(listenNowLink.getByRole('img')).toBeVisible();
  });
});
