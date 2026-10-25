// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { expect, test } from '@playwright/test';

test.describe('Navigation Functionality', { tag: ['@agent', '@smoke'] }, () => {
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
          - link "Speaking":
            - /url: /speaking
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
        - listitem:
          - link "Now":
            - /url: /now
    `);

    // Logo/name link navigates back to home
    await expect(page.getByRole('banner').getByRole('link', { name: 'Debbie O\'Brien', exact: true })).toBeVisible();
  });
});
