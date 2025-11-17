// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', { tag: '@agent' }, () => {
  test('Verify Desktop Navigation Menu', async ({ page }) => {
    // 1. Navigate to the home page (`/`)
    await page.goto('/');

    // 2. Locate the navigation bar in the header
    await expect(page.getByRole('navigation')).toBeVisible();

    // 3. Verify all navigation links are present
    await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "About":
            - /url: /about
        - listitem:
          - link "Videos":
            - /url: /videos
        - listitem:
          - link "Podcasts":
            - /url: /podcasts
        - listitem:
          - link "Courses":
            - /url: /courses
        - listitem:
          - link "Blog":
            - /url: /blog
    `);

    // Logo/name link navigates back to home
    await expect(page.getByRole('link', { name: 'Debbie O\'Brien Debbie O\'Brien' })).toBeVisible();
  });
});
