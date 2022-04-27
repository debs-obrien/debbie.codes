import { test, expect } from '@playwright/test'

test('pagination of blog', async ({ page }) => {
  // Go to /
  await page.goto('')

  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('/blog/all/2')

  // Click text=Prev page
  await page.locator('text=Prev page').click()
  await expect(page).toHaveURL('/blog/all/1')
})
