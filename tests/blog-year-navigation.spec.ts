import { expect, test } from '@playwright/test';

test.describe('Blog Year Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('year navigation section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Browse by Year' })).toBeVisible();
  });

  test('year links navigate to correct year pages', async ({ page }) => {
    // Look for year links
    const yearLinks = page.getByRole('link').filter({ hasText: /^\d{4}$/ });
    const yearCount = await yearLinks.count();
    
    if (yearCount > 0) {
      // Click on the first year link
      const firstYearLink = yearLinks.first();
      const yearText = await firstYearLink.textContent();
      
      await firstYearLink.click();
      
      // Should navigate to year page
      await expect(page).toHaveURL(`/blog/year/${yearText?.trim()}`);
      
      // Should see year-specific content
      await expect(page.getByText(`Posts from ${yearText?.trim()}`)).toBeVisible();
    }
  });

  test('year page shows filtered posts', async ({ page }) => {
    // Navigate to a specific year (using 2024 as example)
    await page.goto('/blog/year/2024');
    
    // Should show year summary
    await expect(page.getByText('Posts from 2024')).toBeVisible();
    
    // Should have back to blog link
    await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
  });
});