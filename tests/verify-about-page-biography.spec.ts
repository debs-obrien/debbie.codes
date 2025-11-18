// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About Page Content', () => {
  test('Verify About Page Biography', async ({ page }) => {
    // 1. Navigate to `/about`
    await page.goto('http://localhost:3020/about');

    // 2. Locate the main heading
    await expect(page.getByRole('heading', { name: 'I\'m Debbie O\'Brien' })).toBeVisible();

    // 3. Read the biography sections
    await expect(page.getByText('With over 15 years experience in Frontend development')).toBeVisible();
    await expect(page.getByRole('link', { name: 'YouTube Channel' })).toBeVisible();
  });
});
