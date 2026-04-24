import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
});

test('blog has a heading, date, content and prev and next links', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();

  await expect(page.getByText('September 3, 2022')).toBeVisible();

  await expect(page.getByRole('img', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();

  await expect(page
    .getByText('My website uses the Nuxt color mode module to allow the user to change the theme'))
    .toBeVisible();

  await page.getByRole('link', { name: 'Challenging Yourself' }).click();

  await expect(page.getByRole('heading', { name: 'Challenging Yourself' })).toBeVisible();

  await page.getByRole('link', { name: 'Testing a Sites Color Mode with Playwright' }).click();

  await expect(page.getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' })).toBeVisible();
});

test('blog prev and next links update when navigating from paginated blog pages', async ({ page }) => {
  await test.step('Open a paginated blog article', async () => {
    await page.goto('/blog/page/2');

    await page.getByRole('link', { name: 'Install Playwright MCP Server in VS Code' }).click();
  });

  await test.step('Verify the first article navigation links', async () => {
    await expect(page.getByRole('heading', { name: 'Install Playwright MCP Server in VS Code' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Next post: Building Your First MCP Server/ })).toHaveAttribute('href', '/blog/building-your-first-mcp-server');
  });

  await test.step('Navigate to the next article and verify the links refresh', async () => {
    await page.getByRole('link', { name: /Next post: Building Your First MCP Server/ }).click();

    await expect(page.getByRole('heading', { name: 'Building Your First MCP Server - A Beginner\'s Tutorial' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Previous post: Install Playwright MCP Server in VS Code/ })).toHaveAttribute('href', '/blog/install-playwright-mcp-server-in-vs-code');
    await expect(page.getByRole('link', { name: /Next post: Delivering a Talk/ })).toHaveAttribute('href', '/blog/delivering-a-talk');
  });
});
