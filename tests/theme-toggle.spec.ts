import { test, expect } from '@playwright/test';

test.describe('Theme Toggle Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://debbie.codes');
  });

  test('Color mode toggle - switches between light and dark themes', async ({ page }) => {
    await test.step('Verify initial dark mode button', async () => {
      const toggleButton = page.getByRole('button', { name: 'dark' });
      await expect(toggleButton).toBeVisible();
    });

    await test.step('Toggle to system mode', async () => {
      await page.getByRole('button', { name: 'dark' }).click();
      
      // After clicking, button should change to 'system'
      await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
    });

    await test.step('Toggle to light mode', async () => {
      await page.getByRole('button', { name: 'system' }).click();
      
      // After clicking, button should change to 'light'
      await expect(page.getByRole('button', { name: 'light' })).toBeVisible();
    });

    await test.step('Toggle back to dark mode', async () => {
      await page.getByRole('button', { name: 'light' }).click();
      
      // After clicking, button should change back to 'dark'
      await expect(page.getByRole('button', { name: 'dark' })).toBeVisible();
    });
  });

  test('Color mode toggle - works across different pages', async ({ page }) => {
    await test.step('Toggle on homepage', async () => {
      // Start from dark mode and click to go to system
      await page.getByRole('button', { name: 'dark' }).click();
      await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
    });
    await test.step('Navigate to blog and verify theme persists', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
      await expect(page).toHaveURL('https://debbie.codes/blog');
      await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
    });

    await test.step('Navigate to podcasts and verify theme persists', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Podcasts' }).click();
      await expect(page).toHaveURL('https://debbie.codes/podcasts');
      await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
      });
    });

  test('Color mode toggle - accessibility and keyboard navigation', async ({ page }) => {
    await test.step('Toggle button is accessible via keyboard', async () => {
      // Start with initial state (dark mode based on page snapshot)
      const toggleButton = page.getByRole('button', { name: 'dark' });
      await toggleButton.focus();
      await expect(toggleButton).toBeFocused();
    });

    await test.step('Toggle via Enter key', async () => {
      const toggleButton = page.getByRole('button', { name: 'dark' });
      await toggleButton.focus();
      await page.keyboard.press('Enter');

      await expect(page.getByRole('button', { name: 'system' })).toBeVisible();
    });

    await test.step('Toggle via Space key', async () => {
      const toggleButton = page.getByRole('button', { name: 'system' });
      await toggleButton.focus();
      await page.keyboard.press('Space');

      await expect(page.getByRole('button', { name: 'light' })).toBeVisible();
    });
  });
});
