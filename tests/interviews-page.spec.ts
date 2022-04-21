import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('http://localhost:8000/')

  // Click text=Interviews >> nth=0
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources/interviews' }*/),
    page.locator('text=Interviews').first().click()
  ])

  // Click h3:has-text("Handling Content on the Modern Web")
  await page
    .locator('h3:has-text("Handling Content on the Modern Web")')
    .click()

  // Click span:has-text("Web") >> nth=1
  await page.locator('span:has-text("Web")').nth(1).click()

  // Click span:has-text("Content") >> nth=1
  await page.locator('span:has-text("Content")').nth(1).click()

  // Click span:has-text("Jamstack")
  await page.locator('span:has-text("Jamstack")').click()

  // Click text=Virtual panel moderated by Kaya of Wordify with leading web personalities Tracy,
  await page
    .locator(
      'text=Virtual panel moderated by Kaya of Wordify with leading web personalities Tracy,'
    )
    .click()

  // Click text=March 24, 2022
  await page.locator('text=March 24, 2022').click()

  // Click lite-youtube:has-text("Handling Content on the Modern Web")
  await page
    .locator('lite-youtube:has-text("Handling Content on the Modern Web")')
    .click()

  // Click button:has-text("Handling Content on the Modern Web")
  await page
    .locator('button:has-text("Handling Content on the Modern Web")')
    .click()
})
