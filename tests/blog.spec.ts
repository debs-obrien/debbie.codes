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

    await page.getByRole('link', { name: 'Playwright MCP Servers Explained Automation and Testing' }).click();
  });

  await test.step('Verify the first article navigation links', async () => {
    await expect(page.getByRole('heading', { name: 'Playwright MCP Servers Explained Automation and Testing' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Next post: Fixing Failing Tests Automatically/ })).toHaveAttribute('href', '/blog/fixing-failing-tests-automatically-with-playwrights-new-healer-agent');
  });

  await test.step('Navigate to the next article and verify the links refresh', async () => {
    await page.getByRole('link', { name: /Next post: Fixing Failing Tests Automatically/ }).click();

    await expect(page.getByRole('heading', { name: /Fixing Failing Tests Automatically with Playwright/ })).toBeVisible();
    await expect(page.getByRole('link', { name: /Previous post: Playwright MCP Servers Explained/ })).toHaveAttribute('href', '/blog/playwright-mcp-servers-explained-automation-and-testing');
    await expect(page.getByRole('link', { name: /Next post: I Built My Own AI Agent/ })).toHaveAttribute('href', '/blog/i-built-my-own-ai-agent-and-you-can-too');
  });
});
