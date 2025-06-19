import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('home contains name and title', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Debbie O'Brien/i })).toBeVisible();
  await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();
});

test('home page has 2 featured posts', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Featured Posts' })).toBeVisible();
  const featuredArticles = page.locator('h2#featured-posts + div > article');
  await expect(featuredArticles).toHaveCount(2);
});

test('home page has recent blog posts with 6 items', async ({ page }) => {
  const recentPosts = page.getByRole('region', { name: /Recent Blog Posts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(6);
});

test('home page has recent videos with 4 items', async ({ page }) => {
  const recentPosts = page.getByRole('region', { name: /Recent Videos/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(4);
});

test('how page has recent podcasts with 4 items', async ({ page }) => {
  const recentPosts = page.getByRole('region', { name: /Recent Podcasts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(3);
});
