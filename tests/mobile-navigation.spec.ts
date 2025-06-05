import { expect, test } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  test.use({ viewport: { width: 375, height: 667 } }); // iPhone SE size

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays hamburger menu button on mobile', async ({ page }) => {
    // Check that hamburger menu button is visible
    await expect(page.getByRole('button', { name: 'open menu' })).toBeVisible();
    
    // Check that main navigation links are hidden initially
    const navigation = page.getByRole('navigation');
    await expect(navigation.getByRole('link', { name: 'About' })).not.toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Videos' })).not.toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Podcasts' })).not.toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Courses' })).not.toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Blog' })).not.toBeVisible();
  });

  test('opening hamburger menu reveals navigation links', async ({ page }) => {
    // Click hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Check that navigation links become visible
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Videos' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Podcasts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Courses' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Blog' })).toBeVisible();
    
    // Check that social media links are also visible
    await expect(page.getByRole('banner').getByRole('link', { name: 'twitter' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'linkedIn' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'github' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'youtube' })).toBeVisible();
    
    // Check that color mode toggle is visible
    await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
  });

  test('navigation links work from mobile menu', async ({ page }) => {
    // Open hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Click on Blog link
    await page.getByRole('link', { name: 'Blog' }).click();
    
    // Should navigate to blog page
    await expect(page).toHaveURL('/blog');
    await expect(page.getByRole('heading', { name: 'Blog' })).toBeVisible();
  });

  test('social media links work from mobile menu', async ({ page }) => {
    // Open hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Test twitter link (with route mocking)
    await page.context().route('https://twitter.com/**', route => route.fulfill({
      body: '<html><body><h1>Twitter</h1></body></html>'
    }));

    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('banner').getByRole('link', { name: 'twitter' }).click()
    ]);
    await expect(page1).toHaveURL('https://twitter.com/debs_obrien');
  });

  test('color mode toggle works from mobile menu', async ({ page }) => {
    // Open hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Test color mode toggle
    await page.getByRole('button', { name: 'system' }).click();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');
    
    // Need to reopen menu after color mode change (menu might close)
    await page.getByRole('button', { name: 'open menu' }).click();
    
    await page.getByRole('button', { name: 'dark' }).click();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'light');
  });

  test('mobile menu works across different pages', async ({ page }) => {
    // Start on home page
    await page.getByRole('button', { name: 'open menu' }).click();
    await page.getByRole('link', { name: 'Videos' }).click();
    
    // Should be on videos page
    await expect(page).toHaveURL('/videos');
    
    // Open menu again and navigate to another page
    await page.getByRole('button', { name: 'open menu' }).click();
    await page.getByRole('link', { name: 'About' }).click();
    
    // Should be on about page
    await expect(page).toHaveURL('/about');
    
    // Verify menu still works
    await page.getByRole('button', { name: 'open menu' }).click();
    await expect(page.getByRole('link', { name: 'Courses' })).toBeVisible();
  });

  test('mobile menu hamburger icon accessibility', async ({ page }) => {
    const hamburgerButton = page.getByRole('button', { name: 'open menu' });
    
    // Check button is focusable
    await hamburgerButton.focus();
    await expect(hamburgerButton).toBeFocused();
    
    // Check button can be activated with keyboard
    await hamburgerButton.press('Enter');
    
    // Menu should open
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('mobile menu on blog page with search functionality', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    
    // Open mobile menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Check that all navigation options are available
    await expect(page.getByRole('link', { name: 'Home', exact: false })).toBeVisible();
    await expect(page.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Videos' })).toBeVisible();
    
    // Close menu and verify search functionality still works
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Test that search input is accessible
    const searchInput = page.getByRole('textbox', { name: 'Search blog posts' });
    await expect(searchInput).toBeVisible();
    
    // Type in search and verify it works
    await searchInput.fill('playwright');
    await page.waitForTimeout(500); // Allow debounce
    
    // Should have filtered results
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });
});
