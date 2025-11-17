// spec: specs/test-plan.md
// seed: tests/seed.spec.ts

import { test, expect } from '@playwright/test';

test.describe('About Page Content', () => {
  test('Verify Awards and Achievements Section', async ({ page }) => {
    // 1. Navigate to `/about`
    await page.goto('http://localhost:3020/about');

    // 2. Scroll to "Awards & Achievements" section
    await expect(page.getByRole('heading', { name: 'Awards & Achievements' })).toBeVisible();
    await expect(page.getByText('Recognition and certifications that reflect my journey in technology and community contribution.')).toBeVisible();

    // 3. Count the number of award cards displayed
    const awardCards = page.locator('main article');
    await expect(awardCards).toHaveCount(8);

    // Verify specific awards are displayed
    await expect(page.getByRole('heading', { name: 'Learn more about GitHub Star Alumni (opens in new tab)' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Learn more about Google Developer Expert (opens in new tab)' })).toBeVisible();
    
    // Verify "Learn More" links are present
    await expect(page.getByRole('link', { name: 'Learn More' }).first()).toBeVisible();
  });
});
