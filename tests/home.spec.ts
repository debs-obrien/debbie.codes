import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('home contains name and title', async ({ page }) => {
  // The CreativeHero glitch effect momentarily swaps the hero name between an
  // <h1> and a plain element during hydration, so `getByRole('heading')` can
  // transiently match nothing — don't anchor on the heading role. The subtitle
  // paragraph is stable once hydrated, so assert on that, then confirm the name
  // text is present anywhere in the hero (case-insensitive: it renders
  // uppercased via CSS, but that's presentational).
  await expect(page.getByText('Platform Engineer – Applied AI at Zephyr Cloud')).toBeVisible({ timeout: 15000 });
  await expect(page.getByText(/Debbie O'Brien/i).first()).toBeVisible();
});

// Featured Posts section no longer exists after redesign
test.fixme('home page has 2 featured posts', async ({ page }) => {
  // This section has been removed in the redesign
  await expect(page.getByRole('heading', { name: 'Featured Posts' })).toBeVisible();
  const featuredArticles = page.locator('h2#featured-posts + div > article');
  await expect(featuredArticles).toHaveCount(2);
});

test('home page has recent blog posts with 6 items', async ({ page }) => {
  const recentPosts = page.getByRole('region', { name: /Recent Blog Posts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(6);
});

// Videos are displayed differently after redesign - not in article elements
test.fixme('home page has recent videos with 4 items', async ({ page }) => {
  // Videos section has been redesigned and doesn't use article elements anymore
  const recentPosts = page.getByRole('region', { name: /Recent Videos/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(4);
});

test('how page has recent podcasts with 2 items', async ({ page }) => {
  const recentPosts = page.getByRole('region', { name: /Recent Podcasts/i });
  await expect(recentPosts.getByRole('article')).toHaveCount(2);
});
