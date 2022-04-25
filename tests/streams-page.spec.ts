import { test, expect } from '@playwright/test'

test('streams page content and youtube videos', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('')

  // Click text=Streams >> nth=0
  await Promise.all([
    page.waitForNavigation(/*{ url: '/resources/guest-live-streams' }*/),
    page.locator('text=Streams').first().click()
  ])

  // Click text=Live Streams as a Guest
  await page.locator('text=Live Streams as a Guest').click()

  // Click h3:has-text("Component Driven Development with React and Bit")
  await page
    .locator('h3:has-text("Component Driven Development with React and Bit")')
    .click()

  // Click text=In this episode we'll learn how to build React components with Bit so that we ca
  await page
    .locator(
      "text=In this episode we'll learn how to build React components with Bit so that we ca"
    )
    .click()

  // Click text=September 8, 2021
  await page.locator('text=September 8, 2021').click()

  // Click lite-youtube:has-text("Component Driven Development with React and Bit")
  await page
    .locator(
      'lite-youtube:has-text("Component Driven Development with React and Bit")'
    )
    .click()

  // Click button:has-text("Component Driven Development with React and Bit")
  await page
    .locator(
      'button:has-text("Component Driven Development with React and Bit")'
    )
    .click()
})
