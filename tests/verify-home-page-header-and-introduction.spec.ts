// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Home Page Header and Introduction', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByRole('heading', { level: 1, name: /Debbie O'Brien/i })).toBeVisible();
    await expect(page.getByText('Developer Educator focused on Playwright, testing & AI agents')).toBeVisible();

    await expect(page).toHaveTitle(/Debbie codes and helps others learn Playwright, testing, React, Nuxt and more/);
  });
});
