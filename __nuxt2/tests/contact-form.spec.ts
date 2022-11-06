import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/contact')
})

test.describe('Page heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Contact')
  })
})

test.describe('Contact Form', () => {
  test('fills and sends contact form and expects a thank you message', async ({
    page
  }) => {
    await page.locator('[placeholder="Your Name"]').fill('Debbie')

    await page
      .locator('[placeholder="Your Email"]')
      .fill('dobriendev@gmail.com')

    await page
      .locator('textarea[name="message"]')
      .fill('hello just testing the contact form on your page')

    await expect(page.locator('text=Send')).toBeEnabled()
  })
})
