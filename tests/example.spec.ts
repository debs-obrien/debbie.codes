import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to http://localhost:8000/
  await page.goto('http://localhost:8000/')

  // Click text=Blog >> nth=0
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog' }*/),
    page.locator('text=Blog').first().click()
  ])

  // Click text=Next page
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/all/2' }*/),
    page.locator('text=Next page').click()
  ])

  // Click text=Nuxt >> nth=1
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/Nuxt/1' }*/),
    page.locator('text=Nuxt').nth(1).click()
  ])

  // Click text=Pagination in Nuxt Content
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/Nuxt/1' }*/),
    page.locator('text=Pagination in Nuxt Content').click()
  ])

  // Click text=Next page
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/Nuxt/2' }*/),
    page.locator('text=Next page').click()
  ])

  // Click text=Adding analytics to your Nuxt site
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/nuxt-analytics' }*/),
    page.locator('text=Adding analytics to your Nuxt site').click()
  ])

  // Click [aria-label="Breadcrumb"] >> text=blog
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog' }*/),
    page.locator('[aria-label="Breadcrumb"] >> text=blog').click()
  ])

  // Click text=React >> nth=1
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/React/1' }*/),
    page.locator('text=React').nth(1).click()
  ])

  // Click text=Theming in React
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/theming-in-react' }*/),
    page.locator('text=Theming in React').click()
  ])

  // Click [aria-label="Breadcrumb"] >> text=blog
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog' }*/),
    page.locator('[aria-label="Breadcrumb"] >> text=blog').click()
  ])

  // Click text=Next page
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/all/2' }*/),
    page.locator('text=Next page').click()
  ])

  // Click text=All >> nth=1
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/all/1' }*/),
    page.locator('text=All').nth(1).click()
  ])

  // Click text=Pagination in Nuxt Content
  await Promise.all([
    page.waitForNavigation(/*{ url: 'http://localhost:8000/blog/pagination-in-nuxt-content' }*/),
    page.locator('text=Pagination in Nuxt Content').click()
  ])
})
