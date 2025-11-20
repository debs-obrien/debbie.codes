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

    // Locate the Featured Podcast region
    const featuredPodcastRegion = page.getByRole('region', { name: 'Featured Podcast' });
    await expect(featuredPodcastRegion).toBeVisible();

    // Verify podcast title is displayed (updated after redesign)
    await expect(featuredPodcastRegion.getByRole('heading', { name: /Testing Made Easy/i, level: 3 })).toBeVisible();
    
    // Verify podcast source (updated after redesign)
    await expect(featuredPodcastRegion.getByText(/The Modern \.NET Show/)).toBeVisible();

    // Verify the podcast link with external URL (updated URL)
    const podcastLink = featuredPodcastRegion.getByRole('link', { name: /Listen to featured podcast episode/i });
    await expect(podcastLink).toBeVisible();
    await expect(podcastLink).toHaveAttribute('href', /dotnetcore\.show/);

    // Verify visual indicator (play button or image) is present
    const visualElement = featuredPodcastRegion.locator('img').first();
    await expect(visualElement).toBeVisible();
  });
});
