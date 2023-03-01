import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
})

test('blog has a heading, date, image and content', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();

  await expect(page.getByText('September 3, 2022')).toBeVisible();

  await expect(page.getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();

  await expect(page
    .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
    .toBeVisible();
});

test('blog has prev and next links', async ({ page }) => {
  await page.getByRole('link', { name: 'Challenging Yourself' }).click();

  await expect(page.getByRole('heading', { name: 'Challenging Yourself' })).toBeVisible();

  await page.getByRole('link', { name: 'Testing a Sites Color Mode with Playwright' }).click();

  await expect(page.getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();
});

