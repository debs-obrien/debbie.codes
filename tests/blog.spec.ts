import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
})

test('blog has a heading', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();
});

test('blog has a date', async ({ page }) => {
  await expect(page.getByText('September 3, 2022')).toBeVisible();
});

test('blog has an image', async ({ page }) => {
  await expect(page.getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();
});

test('blog has a summary', async ({ page }) => {
  await expect(page
    .getByText('My site has a color mode option to change from light theme to dark theme or sepi'))
    .toBeVisible();
});

test('blog has a tag that links to tag page', async ({ page }) => {
  await page
    .getByRole('list')
    .filter({ hasText: 'testingplaywright' })
    .getByRole('link', { name: 'testing' })
    .click();

  await expect(page.getByRole('heading', { name: 'Blog Posts on testing' })).toBeVisible();
});

test('blog has content', async ({ page }) => {
  await expect(page
    .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
    .toBeVisible();
});

test('blog has prev links', async ({ page }) => {
  await page.getByRole('link', { name: 'Challenging Yourself' }).click();

  await expect(page.getByRole('heading', { name: 'Challenging Yourself' })).toBeVisible();
});

test('blog has next links', async ({ page }) => {
  await page.getByRole('link', { name: 'Interviewing with the Big Tech Companies' }).click();

  await expect(page.getByRole('heading', { name: 'Interviewing with the Big Tech Companies' })).toBeVisible();
});
