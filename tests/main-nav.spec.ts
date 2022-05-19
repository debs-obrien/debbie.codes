import { test, expect } from '@playwright/test'

test('main navigation', async ({ page }) => {
  // Go to /
  await page.goto('')

  // Click text=Streams >> nth=0
  await page.locator('header >> a:has-text("Streams")').first().click()
  await expect(page).toHaveURL('/resources/guest-live-streams')

  // Click text=Interviews >> nth=0

  await page.locator('header >> a:has-text("Interviews")').first().click()
  await expect(page).toHaveURL('/resources/interviews')

  // Click text=Podcasts >> nth=0
  await page.locator('header >> a:has-text("podcasts")').first().click()
  await expect(page).toHaveURL('/resources/podcasts')

  // Click text=Courses >> nth=0
  await page.locator('header >> a:has-text("courses")').first().click()
  await expect(page).toHaveURL('/resources/courses')

  // Click text=Talks >> nth=0
  await page.locator('header >> a:has-text("talks")').first().click()
  await expect(page).toHaveURL('/resources/conference-talks')

  // Click text=Featured Posts >> nth=0
  await page.locator('header >> a:has-text("featured posts")').first().click()
  await expect(page).toHaveURL('/resources/featured-posts')

  // Click a:has-text("Blog") >> nth=0
  await page.locator('header >> a:has-text("blog")').first().click()
  await expect(page).toHaveURL('/blog')
})
