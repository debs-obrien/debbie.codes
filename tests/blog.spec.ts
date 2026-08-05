import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
});

test('blog has a heading, date, content and prev and next links', async ({ page }) => {
  await expect(page
    .getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' }))
    .toBeVisible();

  await expect(page.getByRole('link', { name: /Back to blog/ })).toHaveAttribute('href', '/blog');
  await expect(page.getByText('September 3, 2022')).toBeVisible();
  await expect(page.getByText(/\d+ min read/)).toBeVisible();
  await expect(page.getByRole('link', { name: '#testing' })).toBeVisible();
  await expect(page.getByRole('link', { name: '#playwright' })).toBeVisible();

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

    // Anchor navigation on the URL, not a heading. On a cold page load (fresh
    // Endform runner) a click can fire before Nuxt hydration attaches the SPA
    // router, silently leaving us on the listing page — so retry the click
    // until the URL is the article. (A heading-based guard is unreliable here:
    // the "Next post" preview on an article renders the *next* article's title
    // as a heading too, so heading visibility doesn't prove where we are.)
    const articleLink = page.getByRole('link', { name: 'Playwright MCP Servers Explained Automation and Testing' });
    await clickUntilUrl(page, articleLink, /\/blog\/playwright-mcp-servers-explained-automation-and-testing\/?$/);
  });

  await test.step('Verify the first article navigation links', async () => {
    await expect(page.getByRole('heading', { name: 'Playwright MCP Servers Explained Automation and Testing' })).toBeVisible();
    await expect(page.getByRole('link', { name: /Next post: Fixing Failing Tests Automatically/ })).toHaveAttribute('href', '/blog/fixing-failing-tests-automatically-with-playwrights-new-healer-agent');
  });

  await test.step('Navigate to the next article and verify the links refresh', async () => {
    const nextLink = page.getByRole('link', { name: /Next post: Fixing Failing Tests Automatically/ });
    await clickUntilUrl(page, nextLink, /\/blog\/fixing-failing-tests-automatically-with-playwrights-new-healer-agent\/?$/);

    // Assert the prev/next links reflect the new (second) article.
    await expect(page.getByRole('link', { name: /Previous post: Playwright MCP Servers Explained/ })).toHaveAttribute('href', '/blog/playwright-mcp-servers-explained-automation-and-testing', { timeout: 15000 });
    await expect(page.getByRole('link', { name: /Next post: I Built My Own AI Agent/ })).toHaveAttribute('href', '/blog/i-built-my-own-ai-agent-and-you-can-too', { timeout: 15000 });
  });
});

/**
 * Click a link and wait for the SPA URL to match. Retries the click because a
 * click fired before Nuxt hydration attaches the router silently no-ops,
 * leaving the URL unchanged. Only re-clicks while the URL has not yet matched,
 * so a successful navigation is never clicked again.
 */
async function clickUntilUrl(
  page: import('@playwright/test').Page,
  link: import('@playwright/test').Locator,
  urlPattern: RegExp,
) {
  await expect(async () => {
    if (!urlPattern.test(new URL(page.url()).pathname)) {
      await link.click({ timeout: 3000 }).catch(() => {})
    }
    await expect(page).toHaveURL(urlPattern, { timeout: 2000 })
  }).toPass({ timeout: 20000 })
}
