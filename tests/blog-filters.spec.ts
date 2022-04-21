import { test, expect } from '@playwright/test'

test('filters in blog', async ({ page }) => {
  // Go to https://debbie.codes/
  await page.goto('https://debbie.codes/')

  // Click a:has-text("Blog") >> nth=0
  await page.locator('a:has-text("Blog")').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click text=nuxt >> nth=1
  await page.locator('text=nuxt').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/nuxt/1')
  // Click li:has-text("Blog") >> nth=0
  await page.locator('li:has-text("Blog")').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click text=react >> nth=1
  await page.locator('text=react').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click a:has-text("testing") >> nth=0
  await page.locator('a:has-text("testing")').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog/testing/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click a:has-text("javascript")
  await page.locator('a:has-text("javascript")').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/javascript/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click text=typescript
  await page.locator('text=typescript').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/typescript/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click text=dev stuff
  await page.locator('text=dev stuff').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/dev%20stuff/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click a:has-text("performance")
  await page.locator('a:has-text("performance")').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/performance/1')
  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')
  // Click a:has-text("All") >> nth=0
  await page.locator('a:has-text("All")').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/1')
})
