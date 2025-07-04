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
    await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();
    
    // Check that tag filter list is visible
    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    
    // Check that multiple podcast articles are displayed - use at least count to be resilient
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(25); // Ensure we have at least 25 podcasts
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
    await expect(page.getByText('Discover podcast episodes about playwright and related topics')).toBeVisible();
    
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
    
    // Check that we have a reasonable number of podcasts (flexible count)
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(25); // Should have more than 25 podcasts
  });
  
});
