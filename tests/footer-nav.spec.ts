import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('')

  // Click [aria-label="Footer"] >> text=About
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/about' }*/),
    page.locator('[aria-label="Footer"] >> text=About').click()
  ])

  // Click [aria-label="Footer"] >> text=Blog
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog' }*/),
    page.locator('[aria-label="Footer"] >> text=Blog').click()
  ])

  // Click [aria-label="Footer"] >> text=Streams
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources/guest-live-streams' }*/),
    page.locator('[aria-label="Footer"] >> text=Streams').click()
  ])

  // Click [aria-label="Footer"] >> text=Interviews
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources/interviews' }*/),
    page.locator('[aria-label="Footer"] >> text=Interviews').click()
  ])

  // Click [aria-label="Footer"] >> text=Podcasts
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources/podcasts' }*/),
    page.locator('[aria-label="Footer"] >> text=Podcasts').click()
  ])

  // Click [aria-label="Footer"] >> text=Resources
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/resources' }*/),
    page.locator('[aria-label="Footer"] >> text=Resources').click()
  ])

  // Click text=Contact
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/contact' }*/),
    page.locator('text=Contact').click()
  ])
})
