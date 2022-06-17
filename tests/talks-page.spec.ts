import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/resources/conference-talks')
})

test.describe('Page heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('talks')
  })
})

test.describe('Talk Cards', () => {
  test('shows minimum number of talk cards', async ({ page }) => {
    const talks = await page.locator('data-test-id=talks').count()
    await expect(talks).toBeGreaterThanOrEqual(3)
  })
})
