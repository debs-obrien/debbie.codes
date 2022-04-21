import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('http://localhost:8000/')

  // Click text=Talks >> nth=0
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources/conference-talks' }*/),
    page.locator('text=Talks').first().click()
  ])

  // Click text=Debbie's videos from conference talks
  await page.locator("text=Debbie's videos from conference talks").click()

  // Click h3:has-text("It's All About Components")
  await page.locator('h3:has-text("It\'s All About Components")').click()

  // Click text=The frontend is a great place to be in these days and as apps get bigger and big
  await page
    .locator(
      'text=The frontend is a great place to be in these days and as apps get bigger and big'
    )
    .click()

  // Click text=March 31, 2022
  await page.locator('text=March 31, 2022').click()

  // Click lite-youtube:has-text("It's All About Components")
  await page
    .locator('lite-youtube:has-text("It\'s All About Components")')
    .click()

  // Click button:has-text("It's All About Components")
  await page.locator('button:has-text("It\'s All About Components")').click()
})
