import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/resources/podcasts')
})

test.describe('Page heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toHaveText('Guest Podcast Interviews')
  })
})

test.describe('Podcast cards', () => {
  test('shows minimum number of podcast cards', async ({ page }) => {
    const podcasts = await page.locator('data-test-id=podcasts').count()
    await expect(podcasts).toBeGreaterThanOrEqual(3)
  })
})
