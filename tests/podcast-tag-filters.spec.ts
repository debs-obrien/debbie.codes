import { expect, test } from '@playwright/test';

test.describe('Podcast Tag Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/podcasts');
  });

  test('displays all podcasts by default', async ({ page }) => {
    // Check page title and heading
    await expect(page).toHaveTitle(/Podcast Interviews/);
    await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
    
    // Check that description is shown
    await expect(page.getByText('Here\'s a list of all my podcast interviews')).toBeVisible();
    
    // Check that tag filter list is visible
    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    
    // Check that multiple podcast articles are displayed
    const articles = page.locator('article');
    await expect(articles).toHaveCount(27); // Based on what we saw in the exploration
  });

  test('tag filter list contains expected tags', async ({ page }) => {
    const tagsList = page.getByRole('list', { name: 'topics' });
    
    // Check for expected tag filter links
    await expect(tagsList.getByRole('link', { name: 'All' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'bit' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'dev rel' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'jamstack' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'mentoring' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'nuxt' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'playwright' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'react' })).toBeVisible();
    await expect(tagsList.getByRole('link', { name: 'testing' })).toBeVisible();
  });

  test('playwright tag filter shows only playwright-related podcasts', async ({ page }) => {
    // Click on playwright tag
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
    
    // Check URL changed to filtered view
    await expect(page).toHaveURL('/podcasts/tags/playwright');
    
    // Check updated heading
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on playwright' })).toBeVisible();
    
    // Check updated description
    await expect(page.getByText('Here\'s a list of all my podcast interviews with the playwright tag')).toBeVisible();
    
    // Verify all displayed articles have playwright tag
    const articles = page.locator('article');
    const count = await articles.count();
    
    // Should have fewer articles than the full list
    expect(count).toBeLessThan(27);
    expect(count).toBeGreaterThan(0);
    
    // Check that each article has the playwright tag
    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(article.locator('a[href="/podcasts/tags/playwright"]')).toBeVisible();
    }
  });

  test('nuxt tag filter shows only nuxt-related podcasts', async ({ page }) => {
    // Click on nuxt tag
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'nuxt' }).click();
    
    // Check URL changed to filtered view
    await expect(page).toHaveURL('/podcasts/tags/nuxt');
    
    // Check updated heading
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on nuxt' })).toBeVisible();
    
    // Check that articles are displayed and have nuxt tag
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
    
    // Check that each article has the nuxt tag
    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(article.locator('a[href="/podcasts/tags/nuxt"]')).toBeVisible();
    }
  });

  test('bit tag filter shows only bit-related podcasts', async ({ page }) => {
    // Click on bit tag
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'bit' }).click();
    
    // Check URL changed to filtered view
    await expect(page).toHaveURL('/podcasts/tags/bit');
    
    // Check updated heading
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on bit' })).toBeVisible();
    
    // Check that articles are displayed
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('All filter returns to unfiltered podcasts list', async ({ page }) => {
    // First go to a filtered view
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
    await expect(page).toHaveURL('/podcasts/tags/playwright');
    
    // Click "All" to return to unfiltered view
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'All' }).click();
    
    // Check URL is back to all podcasts
    await expect(page).toHaveURL('/podcasts');
    
    // Check heading is back to original
    await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
    
    // Check that we have the full list again
    const articles = page.locator('article');
    await expect(articles).toHaveCount(27);
  });

  test('each podcast article has required elements', async ({ page }) => {
    // Get the first article to test structure
    const firstArticle = page.locator('article').first();
    
    // Should have a link to the podcast
    await expect(firstArticle.locator('a').first()).toBeVisible();
    
    // Should have a heading with the podcast title
    await expect(firstArticle.getByRole('heading', { level: 2 })).toBeVisible();
    
    // Should have a description paragraph
    await expect(firstArticle.locator('p')).toBeVisible();
    
    // Should have tag links
    const tagLinks = firstArticle.locator('a[href^="/podcasts/tags/"]');
    const tagLinkCount = await tagLinks.count();
    expect(tagLinkCount).toBeGreaterThan(0);
  });

  test('podcast external links work correctly', async ({ page }) => {
    // Get first article with external link
    const firstArticle = page.locator('article').first();
    const mainLink = firstArticle.locator('a').first();
    
    // Should be an external link (not starting with /)
    const href = await mainLink.getAttribute('href');
    expect(href).toMatch(/^https?:\/\//);
    
    // Test that it would open in new tab/window (can't actually test the opening due to browser restrictions)
    await expect(mainLink).toBeVisible();
  });

  test('tag filter navigation persists tag list visibility', async ({ page }) => {
    // Start on filtered view
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'react' }).click();
    
    // Check that tag filter list is still visible
    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    
    // Check that all tag options are still available (use the topic list container to be specific)
    const topicsList = page.getByRole('list', { name: 'topics' });
    await expect(topicsList.getByRole('link', { name: 'All' })).toBeVisible();
    await expect(topicsList.getByRole('link', { name: 'playwright' })).toBeVisible();
    await expect(topicsList.getByRole('link', { name: 'nuxt' })).toBeVisible();
  });
});
