import { test, expect } from '@playwright/test'

test.describe('Previous and Next', () => {
  test('checks next page goes to next page', async ({ page }) => {
    await page.goto('/blog')

    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/2')
  })

  test('checks previous page goes to previous page', async ({ page }) => {
    await page.goto('/blog/all/2')
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/1')
  })
})
