import { expect, test } from '@playwright/test';

test.describe('Individual Blog Post Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog/testing-color-mode');
  });

  test('blog post displays correctly with all required elements', async ({ page }) => {
    await test.step('Verify blog post heading and metadata', async () => {
      await expect(page
        .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
        .toBeVisible();

      await expect(page.getByText('September 3, 2022')).toBeVisible();
    });

    await test.step('Verify blog post content', async () => {
      await expect(page.getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();

      await expect(page
        .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
        .toBeVisible();
    });
  });

  test('blog post navigation works correctly', async ({ page }) => {
    await test.step('Navigate to next post', async () => {
      await page.getByRole('link', { name: 'Interviewing with the Big Tech Companies' }).click();

      await expect(page.getByRole('heading', { name: 'Interviewing with the Big Tech Companies' })).toBeVisible();
    });

    await test.step('Navigate back to previous post', async () => {
      await page.getByRole('link', { name: 'Testing a Sites Color Mode with Playwright' }).click();

      await expect(page.getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();
    });
  });
});
