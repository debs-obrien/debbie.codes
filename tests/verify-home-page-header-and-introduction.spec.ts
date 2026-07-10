// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Home Page Header and Introduction', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. Locate the main heading. The CreativeHero glitch effect intermittently
    // detaches/re-mounts the h1 during the first few seconds of hydration, so
    // give the visibility assertion a longer window to ride out the animation
    // rather than landing in a transient gap (fails on cold Endform runners).
    await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible({ timeout: 15000 });

    // 3. Locate the subtitle describing Debbie's role
    await expect(page.getByText('Platform Engineer – Applied AI at Zephyr Cloud')).toBeVisible();

    // Verify page title includes expected text
    await expect(page).toHaveTitle(/Debbie codes and helps others learn Playwright, testing, React, Nuxt and more/);
  });
});
