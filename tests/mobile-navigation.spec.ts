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
    
    // Check that navigation links become visible (use navigation role to be more specific)
    const navigation = page.getByRole('navigation');
    await expect(navigation.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Videos' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Podcasts' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Courses' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Blog' })).toBeVisible();
    
    // Check that social media links are also visible
    // Using more specific role-based selectors to target the mobile menu social links
    const mobileMenu = page.locator('div.text-white.bg-dark').filter({ visible: true });
    await expect(mobileMenu.getByRole('link', { name: 'x' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'linkedIn' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'github' })).toBeVisible();
    await expect(mobileMenu.getByRole('link', { name: 'youtube' })).toBeVisible();
    
    // Check that color mode toggle is visible
    await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
  });

  test('navigation links work from mobile menu', async ({ page }) => {
    // Open hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Click on Blog link (use navigation role to be more specific)
    await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
    
    // Should navigate to blog page
    await expect(page).toHaveURL('/blog');
    await expect(page.getByRole('heading', { level: 1, name: 'All Blog Posts' })).toBeVisible();
  });

  test('social media links work from mobile menu', async ({ page }) => {
    // Open hamburger menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Test X link (with route mocking)
    await page.context().route('https://x.com/**', route => route.fulfill({
      body: '<html><body><h1>X</h1></body></html>'
    }));

    const mobileMenu = page.locator('div.text-white.bg-dark').filter({ visible: true });
    const [page1] = await Promise.all([
      page.waitForEvent('popup'),
      mobileMenu.getByRole('link', { name: 'x' }).click()
    ]);
    await expect(page1).toHaveURL('https://x.com/debs_obrien');
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
    await page.getByRole('navigation').getByRole('link', { name: 'Videos' }).click();
    
    // Should be on videos page
    await expect(page).toHaveURL('/videos');
    
    // Open menu again and navigate to another page
    await page.getByRole('button', { name: 'open menu' }).click();
    await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
    
    // Should be on about page
    await expect(page).toHaveURL('/about');
    
    // Verify menu still works
    await page.getByRole('button', { name: 'open menu' }).click();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Courses' })).toBeVisible();
  });

  test('mobile menu hamburger icon accessibility', async ({ page }) => {
    const hamburgerButton = page.getByRole('button', { name: 'open menu' });
    
    // Check button is focusable
    await hamburgerButton.focus();
    await expect(hamburgerButton).toBeFocused();
    
    // Check button can be activated with keyboard
    await hamburgerButton.press('Enter');
    
    // Menu should open
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
  });

  test('mobile menu on blog page with search functionality', async ({ page }) => {
    // Navigate to blog page
    await page.goto('/blog');
    
    // Open mobile menu
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Check that all navigation options are available (no Home link in navigation)
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Videos' })).toBeVisible();
    
    // Close menu by clicking the button again
    await page.getByRole('button', { name: 'open menu' }).click();
    
    // Wait for menu to close
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).not.toBeVisible();
    
    // Test that search input is accessible directly on the blog page
    // Use a more generic selector as the input might not have the proper accessibility name
    const searchInput = page.getByRole('searchbox');
    await expect(searchInput).toBeVisible();
    
    // Type in search and verify it works
    await searchInput.fill('playwright');
    
    // Should have filtered results
    const articles = page.locator('article');
    const count = await articles.count();
    expect(count).toBeGreaterThan(0);
  });
});
