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
    await expect(page.getByRole('contentinfo')).toMatchAriaSnapshot(`
      - contentinfo:
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
        - list:
          - listitem:
            - link "x":
              - /url: https://x.com/debs_obrien
              - img
          - listitem:
            - link "LinkedIn":
              - /url: https://www.linkedin.com/in/debbie-o-brien-1a199975/
              - img
          - listitem:
            - link "YouTube":
              - /url: https://www.youtube.com/c/DebbieOBrien
              - img
          - listitem:
            - link "Twitch":
              - /url: https://www.twitch.tv/debs_obrien
              - img
          - listitem:
            - link "GitHub":
              - /url: https://github.com/debs-obrien
          - listitem:
            - link "Devto":
              - /url: https://dev.to/debs_obrien
              - img
          - listitem:
            - link "buy me a coffee":
              - /url: https://www.buymeacoffee.com/debbieobrien
              - img
        - paragraph: © Debbie O'Brien, Palma de Mallorca, Spain
    `);

    // Verify copyright text is displayed
    await expect(page.getByText('© Debbie O\'Brien, Palma de Mallorca, Spain')).toBeVisible();
  });
});
