// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Navigation Functionality', { tag: '@agent' }, () => {
  test('Verify Footer Navigation', async ({ page }) => {
    // 1. Navigate to any page
    await page.goto('/');

    // 2. Scroll to the footer
    await expect(page.getByRole('contentinfo', { name: '' })).toBeVisible();

    // 3. Verify footer navigation links
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - list:
        - listitem: "About"
        - listitem: "Videos"
        - listitem: "Podcasts"
        - listitem: "Courses"
        - listitem: "Blog"
    `);

    // Verify copyright text is displayed
    await expect(page.getByText('© Debbie O\'Brien, Palma de Mallorca, Spain')).toBeVisible();
  });
});
