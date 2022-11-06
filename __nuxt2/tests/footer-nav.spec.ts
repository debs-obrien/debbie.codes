import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Footer', () => {
  test('checks the about link goes to the correct page', async ({ page }) => {
    page.locator('[aria-label="Footer"] >> text=About').click()
    await expect(page).toHaveURL('/about')
  })

  test('checks the blog link goes to the correct page', async ({ page }) => {
    page.locator('[aria-label="Footer"] >> text=Blog').click()
    await expect(page).toHaveURL('/blog')
  })

  test('checks the live streams link goes to the correct page', async ({
    page
  }) => {
    page.locator('[aria-label="Footer"] >> text=Streams').click()
    await expect(page).toHaveURL('/resources/guest-live-streams')
  })

  test('checks the interviews link goes to the correct page', async ({
    page
  }) => {
    page.locator('[aria-label="Footer"] >> text=Interviews').click()
    await expect(page).toHaveURL('/resources/interviews')
  })

  test('checks the podcasts link goes to the correct page', async ({
    page
  }) => {
    page.locator('[aria-label="Footer"] >> text=Podcasts').click()
    await expect(page).toHaveURL('/resources/podcasts')
  })

  test('checks the resources link goes to the correct page', async ({
    page
  }) => {
    page.locator('[aria-label="Footer"] >> text=Resources').click()
    await expect(page).toHaveURL('/resources')
  })

  test('checks the contact link goes to the correct page', async ({ page }) => {
    page.locator('[aria-label="Footer"] >> text=Contact').click()
    await expect(page).toHaveURL('/contact')
  })
})
