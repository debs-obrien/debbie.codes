import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
})

test('test', async ({ page }) => {
  await page.goto('http://localhost:3000/');

  await expect(page.getByRole('heading', { name: 'Debbie O\'Brien' })).toBeVisible();

  await expect(page.getByText('Senior Program Manager at Microsoft')).toBeVisible();

  await expect(page.getByRole('heading', { name: 'Featured Post' })).toBeVisible();
})
