// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Award Badges Display', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. Verify Google GDE badge link is present
    await expect(page.getByRole('link', { name: 'Google GDE' })).toBeVisible();

    // 3. Verify Former Microsoft MVP badge link is present
    await expect(page.getByRole('link', { name: 'Former Microsoft MVP' })).toBeVisible();

    // 4. Verify GitHub Star Alumni badge link is present
    await expect(page.getByRole('link', { name: 'GitHub Star Alumni' })).toBeVisible();

    // 5. Verify Nuxt Ambassador badge link is present
    await expect(page.getByRole('link', { name: 'Nuxt Ambassador' })).toBeVisible();
  });
});
