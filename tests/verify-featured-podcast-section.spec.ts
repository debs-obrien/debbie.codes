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
    await expect(featuredPodcastArticle.getByRole('heading', { name: 'Changing Testing using Playwright MCP', level: 3 })).toBeVisible();
    
    // Verify podcast source
    await expect(featuredPodcastArticle.getByText('.NET Rocks! Podcast')).toBeVisible();

    // Verify the podcast link with external URL
    const podcastLink = page.getByRole('link', { name: /Listen to featured podcast episode.*Changing Testing using Playwright MCP.*\.NET Rocks! Podcast/ });
    await expect(podcastLink).toBeVisible();
    await expect(podcastLink).toHaveAttribute('href', 'https://www.dotnetrocks.com/details/1954');

    // Verify visual indicator (play button or image) is present
    const visualElement = featuredPodcastArticle.locator('svg, img').first();
    await expect(visualElement).toBeAttached();
  });
});
