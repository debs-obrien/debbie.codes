import { test, expect } from '@playwright/test'

test.describe('Contact Form', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('Clicking steams in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Streams")').first().click()
    await expect(page).toHaveURL('/resources/guest-live-streams')
  })

  test('Clicking interviews in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Interviews")').first().click()
    await expect(page).toHaveURL('/resources/interviews')
  })

  test('Clicking podcasts in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Podcasts")').first().click()
    await expect(page).toHaveURL('/resources/podcasts')
  })

  test('Clicking courses in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Courses")').first().click()
    await expect(page).toHaveURL('/resources/courses')
  })

  test('Clicking talks in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Talks")').first().click()
    await expect(page).toHaveURL('/resources/conference-talks')
  })

  test('Clicking featured-posts in navigation goes to correct page', async ({
    page
  }) => {
    await page.locator('header >> a:has-text("Featured Posts")').first().click()
    await expect(page).toHaveURL('/resources/featured-posts')
  })

  test('Clicking blog in navigation goes to correct page', async ({ page }) => {
    await page.locator('header >> a:has-text("Blog")').first().click()
    await expect(page).toHaveURL('/blog')
  })
})
