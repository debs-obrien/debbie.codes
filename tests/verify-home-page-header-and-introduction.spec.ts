// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Home Page Content Display', { tag: '@agent' }, () => {
  test('Verify Home Page Header and Introduction', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. The CreativeHero glitch effect swaps the hero name between an <h1> and
    // a plain element and renders its accessible name inconsistently during
    // hydration, so don't anchor on the heading role/name. Gate on the stable
    // subtitle (proves hydration finished), then confirm the name text is
    // present (case-insensitive: it renders uppercased via CSS).
    await expect(page.getByText('Platform Engineer – Applied AI at Zephyr Cloud')).toBeVisible({ timeout: 15000 });
    await expect(page.getByText(/Debbie O'Brien/i).first()).toBeVisible();

    // Verify page title includes expected text
    await expect(page).toHaveTitle(/Debbie codes and helps others learn Playwright, testing, React, Nuxt and more/);
  });
});
