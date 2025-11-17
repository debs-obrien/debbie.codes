// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Home Page Header and Introduction', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('http://localhost:3020/');

    // 2. Locate the main heading
    await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible();

    // 3. Locate the subtitle describing Debbie's role
    await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();

    // Verify page title includes expected text
    await expect(page).toHaveTitle(/Debbie codes and helps others learn Playwright, testing, React, Nuxt and more/);
  });
});
