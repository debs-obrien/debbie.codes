import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('home contains name and title', async ({ page }) => {
  await expect(page.getByRole('heading', { name: /Debbie O'Brien/i })).toBeVisible();
  await expect(page.getByText('Senior Program Manager at Microsoft')).toBeVisible();
});

test('home page has 1 featured post', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Featured Post' })).toBeVisible();
  await expect(page.getByRole('article', { name: 'featured post' })).toHaveCount(1);
});

test('home page has recent blog posts with 6 items', async ({ page }) => {
  const recentPosts = await page.getByRole('region', { name: /Recent Blog Posts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(6);
});

test('home page has recent videos with 5 items', async ({ page }) => {
  const recentPosts = await page.getByRole('region', { name: /Recent Videos/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(5);
});

test('how page has recent podcasts with 4 items', async ({ page }) => {
  const recentPosts = await page.getByRole('region', { name: /Recent Podcasts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(3);
});
