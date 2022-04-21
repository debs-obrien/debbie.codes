import { test, expect } from '@playwright/test'

test('color mode changes color when clicked', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('http://localhost:8000/')

  // Click text=Blog >> nth=0
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog' }*/),
    page.locator('text=Blog').first().click()
  ])

  // Click path >> nth=0
  await page.locator('[aria-label="dark mode"]').click()

  // Click b:has-text("dark")
  await page.locator('b:has-text("dark")').click()

  // Click .feather.feather-coffee
  await page.locator('[aria-label="sepia mode"]').click()

  // Click text=sepia
  await page.locator('text=sepia').click()

  // Click .feather.feather-sun
  await page.locator('[aria-label="light mode"]').click()

  // Click b:has-text("light")
  await page.locator('b:has-text("light")').click()

  // Click .feather >> nth=0
  await page.locator('[aria-label="system mode"]').click()

  // Click text=(light mode detected)
  await page.locator('text=(light mode detected)').click()

  // Click text=system
  await page.locator('text=system').click()
})
