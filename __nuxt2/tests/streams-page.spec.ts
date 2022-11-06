import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/resources/guest-live-streams')
})

test.describe('Page Heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Streams')
  })
})

test.describe('Live stream cards', () => {
  test('shows minimum number of live stream cards', async ({ page }) => {
    const podcasts = await page.locator('data-test-id=live-streams').count()
    await expect(podcasts).toBeGreaterThanOrEqual(3)
  })
})
