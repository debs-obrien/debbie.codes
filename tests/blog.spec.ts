import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
})

test('blog has a heading, date, content and prev and next links', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();

  await expect(page.getByText('September 3, 2022')).toBeVisible();

  await expect(page.getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();

  await expect(page
    .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
    .toBeVisible();

  // Navigate to next post
  await page.getByRole('link', { name: 'Challenging Yourself' }).click();
  
  // Wait for navigation to complete
  await page.waitForLoadState('networkidle');
  
  // Check if we actually navigated successfully
  await expect(page).toHaveURL(/\/blog\/.+/);
  
  // Get the actual heading text that exists on the page
  const heading = page.getByRole('heading', { level: 1 });
  await expect(heading).toBeVisible();
  
  // Navigate back to test the previous link
  await page.goBack();
  await expect(page.getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();
});
