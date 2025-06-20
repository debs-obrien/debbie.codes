import { expect, test } from '@playwright/test';

test.describe('Error Pages', () => {
  test('displays custom 404 page for non-existent URLs', async ({ page }) => {
    await page.goto('/non-existent-page');
    
    // Check that the custom 404 content is displayed
    await expect(page.getByRole('heading', { name: 'Ooops looks like that page doesn\'t exist' })).toBeVisible();
    
    // Check for the descriptive text
    await expect(page.locator('text=Sorry about that. No idea what went wrong but hey, nobody\'s perfect')).toBeVisible();
    
    // Check that navigation is still available
    await expect(page.getByRole('navigation')).toBeVisible();
    await expect(page.getByRole('banner')).toBeVisible();
    await expect(page.getByRole('contentinfo')).toBeVisible();
    
    // Check for the "Take me there!" button
    await expect(page.getByRole('link', { name: 'Take me there!' })).toBeVisible();
  });

  test('"Take me there!" button redirects to home page', async ({ page }) => {
    await page.goto('/invalid-url');
    
    await page.getByRole('link', { name: 'Take me there!' }).click();
    
    // Should redirect to home page
    await expect(page).toHaveURL('/');
    
    // Should show home page content - specify level 1 heading to avoid conflicts
    await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible();
    await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();
  });

  test('404 page maintains proper page structure', async ({ page }) => {
    await page.goto('/another-non-existent-page');
    
    // Navigation should be functional - use specific navigation locators
    await expect(page.getByRole('navigation').getByRole('link', { name: 'About' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Videos' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Podcasts' })).toBeVisible();
    await expect(page.getByRole('navigation').getByRole('link', { name: 'Courses' })).toBeVisible();
    
    // Footer links should be present
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'twitter' })).toBeVisible();
    await expect(page.getByRole('contentinfo').getByRole('link', { name: 'github' })).toBeVisible();
    
    // Test navigation from 404 page
    await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
    await expect(page).toHaveURL('/blog');
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
