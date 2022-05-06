import { test, expect } from '@playwright/test'

test('fills and sends contact form and expects a thank you message', async ({
  page
}) => {
  test.slow()
  // Go to http://localhost:8000/
  await page.goto('')

  // Click text=Contact
  await page.locator('text=Contact').click()
  await expect(page).toHaveURL('/contact')

  // Fill [placeholder="Your Name"]
  await page.locator('[placeholder="Your Name"]').fill('Debbie')

  // Fill [placeholder="Your Email"]
  await page.locator('[placeholder="Your Email"]').fill('dobriendev@gmail.com')

  // Click textarea[name="message"]
  await page
    .locator('textarea[name="message"]')
    .fill('hello just testing the contact form on your page')

  await expect(page.locator('text=Send')).toBeEnabled()
})
