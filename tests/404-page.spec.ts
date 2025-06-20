import { expect, test } from '@playwright/test';

test.describe('404 Error Page', () => {
  test('displays proper 404 page for non-existent routes', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Check that the error heading is visible
    await expect(page.getByRole('heading', { name: "Ooops looks like that page doesn't exist" })).toBeVisible();
    
    // Check that the error message is displayed
    await expect(page.getByText('Sorry about that. No idea what went wrong but hey, nobody\'s perfect. Lets take you somewhere that actually exists. go.')).toBeVisible();
    
    // Check that the "Take me there!" link is present
    await expect(page.getByRole('link', { name: 'Take me there!' })).toBeVisible();
    
    // Check that the broken connection image is displayed
    await expect(page.getByRole('img', { name: 'broken connection' })).toBeVisible();
  });

  test('404 page "Take me there!" link navigates to home page', async ({ page }) => {
    await page.goto('/another-non-existent-page');
    
    // Click the "Take me there!" link
    await page.getByRole('link', { name: 'Take me there!' }).click();
    
    // Should navigate to the home page
    await expect(page).toHaveURL('/');
    
    // Check that we're on the home page by looking for the main heading (level 1)
    await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible();
  });

  test('404 page maintains header and footer navigation', async ({ page }) => {
    await page.goto('/yet-another-non-existent-page');
    
    // Check that navigation header is still present
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('navigation')).toBeVisible();
    
    // Check main navigation links are present - scope to banner/navigation to avoid footer duplicates
    await expect(page.getByRole('banner').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Videos' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Podcasts' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Courses' })).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Blog' })).toBeVisible();
    
    // Check that footer is present with social links
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'twitter' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'github' })).toBeVisible();
  });

  test('navigation from 404 page works correctly', async ({ page }) => {
    await page.goto('/some-random-page');
    
    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');
    
    // Make sure the banner and its navigation links are visible
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('banner').getByRole('link', { name: 'Blog' })).toBeVisible();
    
    // Navigate to different sections from the 404 page - use banner to avoid footer duplicates
    await page.getByRole('banner').getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');
    
    // Go back to a 404 page and test another navigation
    await page.goto('/another-random-page');
    await page.waitForLoadState('networkidle');
    await expect(page.getByRole('banner').getByRole('link', { name: 'About' })).toBeVisible();
    await page.getByRole('banner').getByRole('link', { name: 'About' }).click();
    await expect(page).toHaveURL('/about');
  });

  test('404 page has accessible content', async ({ page }) => {
    await page.goto('/missing-page');
    
    // Check for proper heading structure
    const mainHeading = page.getByRole('heading', { level: 1 });
    await expect(mainHeading).toBeVisible();
    await expect(mainHeading).toHaveText('Ooops looks like that page doesn\'t exist');
    
    // Check that images have alt text or are decorative
    const images = page.locator('img');
    const imageCount = await images.count();
    
    if (imageCount > 0) {
      for (let i = 0; i < imageCount; i++) {
        const img = images.nth(i);
        const alt = await img.getAttribute('alt');
        // Images should either have alt text or be decorative (empty alt for decorative images is acceptable)
        expect(alt !== null).toBeTruthy();
      }
    }
  });
});
