import { test, expect } from '@playwright/test'

test('filters in blog', async ({ page }) => {
  // Go to /
  await page.goto('')

  // Click a:has-text("Blog") >> nth=0
  await page.locator('a:has-text("Blog")').first().click()
  await expect(page).toHaveURL('/blog')
  // Click text=nuxt >> nth=1
  await page.locator('text=nuxt').nth(1).click()
  await expect(page).toHaveURL('/blog/nuxt/1')
  // Click li:has-text("Blog") >> nth=0
  await page.locator('li:has-text("Blog")').first().click()
  await expect(page).toHaveURL('/blog')
  // Click text=react >> nth=1
  await page.locator('text=react').nth(1).click()
  await expect(page).toHaveURL('/blog/react/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click a:has-text("testing") >> nth=0
  await page.locator('a:has-text("testing")').first().click()
  await expect(page).toHaveURL('/blog/testing/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click a:has-text("javascript")
  await page.locator('a:has-text("javascript")').click()
  await expect(page).toHaveURL('/blog/javascript/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click text=typescript
  await page.locator('text=typescript').click()
  await expect(page).toHaveURL('/blog/typescript/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click text=dev stuff
  await page.locator('text=dev stuff').click()
  await expect(page).toHaveURL('/blog/dev%20stuff/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click a:has-text("performance")
  await page.locator('a:has-text("performance")').click()
  await expect(page).toHaveURL('/blog/performance/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('/blog')
  // Click a:has-text("All") >> nth=0
  await page.locator('a:has-text("All")').first().click()
  await expect(page).toHaveURL('/blog/all/1')
})
