import type { Page } from '@playwright/test';
import { expect, test } from './fixtures';

// The header toggle is two-state: every click switches to the opposite of
// what is on screen. When that matches the OS setting, it goes back to
// following the system instead of pinning a theme.

function themeToggle(page: Page, isMobile: boolean) {
  const toggle = page.getByRole('button', { name: /^Switch to (light|dark) theme$/ });
  return isMobile ? toggle.nth(1) : toggle.first();
}

async function openMenuIfMobile(page: Page, isMobile: boolean) {
  if (isMobile)
    await page.getByRole('button', { name: 'open menu' }).click();
}

async function storedPreference(page: Page) {
  return page.evaluate(() => localStorage.getItem('nuxt-color-mode'));
}

test.describe('dark OS', () => {
  test.use({ colorScheme: 'dark' });

  test('every click changes the theme, and switching back follows the system', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');

    await test.step('starts on system (dark) with native UI in dark', async () => {
      await expect(html).toHaveClass('dark');
      await expect(html).toHaveCSS('color-scheme', 'dark');
      await openMenuIfMobile(page, isMobile);
      await expect(themeToggle(page, isMobile)).toHaveAccessibleName('Switch to light theme');
    });

    await test.step('first click switches to light and pins it', async () => {
      await themeToggle(page, isMobile).click();
      await expect(html).toHaveClass('light');
      await expect(html).toHaveCSS('color-scheme', 'light');
      await expect(themeToggle(page, isMobile)).toHaveAccessibleName('Switch to dark theme');
      expect(await storedPreference(page)).toBe('light');
    });

    await test.step('second click goes back to following the system', async () => {
      await themeToggle(page, isMobile).click();
      await expect(html).toHaveClass('dark');
      await expect(html).toHaveCSS('color-scheme', 'dark');
      await expect(themeToggle(page, isMobile)).toHaveAccessibleName('Switch to light theme');
      expect(await storedPreference(page)).toBe('system');
    });
  });
});

test.describe('light OS', () => {
  test.use({ colorScheme: 'light' });

  test('first click switches to dark, second click returns to system', async ({ page, isMobile }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    const html = page.locator('html');

    await expect(html).toHaveClass('light');
    await expect(html).toHaveCSS('color-scheme', 'light');
    await openMenuIfMobile(page, isMobile);

    await themeToggle(page, isMobile).click();
    await expect(html).toHaveClass('dark');
    expect(await storedPreference(page)).toBe('dark');

    await themeToggle(page, isMobile).click();
    await expect(html).toHaveClass('light');
    expect(await storedPreference(page)).toBe('system');
  });
});
