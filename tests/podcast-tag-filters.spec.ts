import { expect, test } from '@playwright/test';

test.describe('Podcast Tag Filtering', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/podcasts');
  });

  test('displays all podcasts by default', async ({ page }) => {
    await expect(page).toHaveTitle(/Podcast Interviews/);
    await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
    
    await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();
    
    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(25);
  });

  test('tag filter list contains expected tags', async ({ page }) => {
    const tagsList = page.getByRole('list', { name: 'topics' });
    
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
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
    
    await expect(page).toHaveURL('/podcasts/tags/playwright');
    
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on playwright' })).toBeVisible();
    
    await expect(page.getByText('Discover podcast episodes about playwright and related topics')).toBeVisible();
    
    const articles = page.locator('article');
    const count = await articles.count();
    
    expect(count).toBeLessThan(27);
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(article.locator('a[href="/podcasts/tags/playwright"]')).toBeVisible();
    }
  });

  test('nuxt tag filter shows only nuxt-related podcasts', async ({ page }) => {
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'nuxt' }).click();
    
    await expect(page).toHaveURL('/podcasts/tags/nuxt');
    
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on nuxt' })).toBeVisible();
    
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
    
    for (let i = 0; i < count; i++) {
      const article = articles.nth(i);
      await expect(article.locator('a[href="/podcasts/tags/nuxt"]')).toBeVisible();
    }
  });

  test('bit tag filter shows only bit-related podcasts', async ({ page }) => {
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'bit' }).click();
    
    await expect(page).toHaveURL('/podcasts/tags/bit');
    
    await expect(page.getByRole('heading', { name: 'Podcast Interviews on bit' })).toBeVisible();
    
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });

  test('All filter returns to unfiltered podcasts list', async ({ page }) => {
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
    await expect(page).toHaveURL('/podcasts/tags/playwright');
    
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'All' }).click();
    
    await expect(page).toHaveURL('/podcasts');
    
    await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
    
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(25);
  });
  
});
