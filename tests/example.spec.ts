import { test, expect, chromium } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to https://debbie.codes/
  await page.goto('https://debbie.codes/')

  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/2')

  // Click text=Nuxt >> nth=1
  await page.locator('text=Nuxt').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/Nuxt/1')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/Nuxt/2')

  // Click text=Prev page
  await page.locator('text=Prev page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/Nuxt/1')

  // Click a:has-text("React")
  await page.locator('a:has-text("React")').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/React/1')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/React/2')

  // Click text=All >> nth=1
  await page.locator('text=All').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/1')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/2')

  // Click text=Prev page
  await page.locator('text=Prev page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/1')
})
