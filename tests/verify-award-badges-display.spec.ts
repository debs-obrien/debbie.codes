// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  // Award badges are no longer displayed on the home page after the redesign
  test.fixme('Verify Award Badges Display', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. Locate the awards/badges section below the introduction
    // Note: These badges have been removed in the redesign
    // Verify Google GDE badge link is present
    await expect(page.getByRole('link', { name: 'Google GDE' })).toBeVisible();

    // Verify Former Microsoft MVP badge link is present
    await expect(page.getByRole('link', { name: 'Former Microsoft MVP' })).toBeVisible();

    // Verify GitHub Star Alumni badge link is present
    await expect(page.getByRole('link', { name: 'GitHub Star Alumni' })).toBeVisible();

    // Verify Nuxt Ambassador badge link is present
    await expect(page.getByRole('link', { name: 'Nuxt Ambassador' })).toBeVisible();
  });
});
