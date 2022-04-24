import { test, expect } from '@playwright/test'

test('main navigation', async ({ page }) => {
  // Go to /
  await page.goto('')

  // Click text=Streams >> nth=0
  await page.locator('text=Streams').first().click()
  await expect(page).toHaveURL('/resources/guest-live-streams')

  // Click text=Interviews >> nth=0
  await page.locator('text=Interviews').first().click()
  await expect(page).toHaveURL('/resources/interviews')

  // Click text=Podcasts >> nth=0
  await page.locator('text=Podcasts').first().click()
  await expect(page).toHaveURL('/resources/podcasts')

  // Click text=Courses >> nth=0
  await page.locator('text=Courses').first().click()
  await expect(page).toHaveURL('/resources/courses')

  // Click text=Talks >> nth=0
  await page.locator('text=Talks').first().click()
  await expect(page).toHaveURL('/resources/conference-talks')

  // Click text=Featured Posts >> nth=0
  await page.locator('text=Featured Posts').first().click()
  await expect(page).toHaveURL('/resources/featured-posts')

  // Click a:has-text("Blog") >> nth=0
  await page.locator('a:has-text("Blog")').first().click()
  await expect(page).toHaveURL('/blog')
})
