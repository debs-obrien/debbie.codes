import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/resources/interviews')
})

test.describe('Page heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Guest Interviews')
  })
})

test.describe('Interview Cards', () => {
  test('shows minimum number of interview cards', async ({ page }) => {
    const interviews = await page.locator('data-test-id=interviews').count()
    await expect(interviews).toBeGreaterThanOrEqual(3)
  })
})
