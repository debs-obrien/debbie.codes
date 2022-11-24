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
  await expect(page
    .getByText('September 3, 2022'))
    .toBeVisible();
});

test('blog has an image', async ({ page }) => {
  await expect(page
    .getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();
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

  await expect(page
    .getByRole('heading', { name: 'Blog Posts on testing' }))
    .toBeVisible();
});

test('blog has content', async ({ page }) => {
  await expect(page
    .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
    .toBeVisible();
});

test('blog has a working TOC', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Table of contents' }))
    .toBeVisible();

  await page.getByRole('complementary').getByRole('link', { name: 'Getting Started' })
    .click();

  await expect(page
    .getByRole('heading', { name: 'Getting Started' })
    .getByRole('link', { name: 'Getting Started' }))
    .toBeVisible();

  await page
    .getByRole('complementary')
    .getByRole('link', { name: 'Setting the Base' })
    .click();

  await expect(page
    .getByRole('heading', { name: 'Setting the Base' })
    .getByRole('link', { name: 'Setting the Base' }))
    .toBeVisible();

  await page
    .getByRole('complementary')
    .getByRole('link', { name: 'Checking it works' })
    .click();

  await expect(page
    .getByRole('heading', { name: 'Checking it works' })
    .getByRole('link', { name: 'Checking it works' }))
    .toBeVisible();
});

test('blog has prev links', async ({ page }) => {
  await page
    .getByRole('link', { name: 'Testing a Button Component' })
    .click();

  await expect(page
    .getByRole('heading', { name: 'Testing a Button Component' }))
    .toBeVisible();
});

test('blog has next links', async ({ page }) => {
  await page
    .getByRole('link', { name: 'Testing iframes with Playwright' })
    .click();

  await expect(page
    .getByRole('link', { name: 'Testing iframes with Playwright' }))
    .toBeVisible();
});
