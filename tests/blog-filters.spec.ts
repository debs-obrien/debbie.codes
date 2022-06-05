import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/blog')
})

test.describe('Page Heading', () => {
  test('checks the title', async ({ page }) => {
    await expect(page.locator('h1')).toContainText('Blog')
  })
})

test.describe('Filters', () => {
  test('checks nuxt filter goes to blog with nuxt url', async ({ page }) => {
    await page.locator('data-test-id=filters >> a:has-text("nuxt")').click()
    await expect(page).toHaveURL('/blog/nuxt/1')
  })

  test('checks react filter goes to blog with react url', async ({ page }) => {
    await page.locator('data-test-id=filters >> a:has-text("react")').click()
    await expect(page).toHaveURL('/blog/react/1')
  })

  test('checks testing filter goes to blog with testing url', async ({
    page
  }) => {
    await page.locator('data-test-id=filters >> a:has-text("testing")').click()
    await expect(page).toHaveURL('/blog/testing/1')
  })

  test('checks javascript filter goes to blog with javascript url', async ({
    page
  }) => {
    await page
      .locator('data-test-id=filters >> a:has-text("javascript")')
      .click()
    await expect(page).toHaveURL('/blog/javascript/1')
  })

  test('checks typescript filter goes to blog with typescript url', async ({
    page
  }) => {
    await page
      .locator('data-test-id=filters >> a:has-text("typescript")')
      .click()
    await expect(page).toHaveURL('/blog/typescript/1')
  })

  test('checks lifestyle filter goes to blog with lifestyle url', async ({
    page
  }) => {
    await page
      .locator('data-test-id=filters >> a:has-text("lifestyle")')
      .click()
    await expect(page).toHaveURL('/blog/lifestyle/1')
  })

  test('checks performance filter goes to blog with performance url', async ({
    page
  }) => {
    await page
      .locator('data-test-id=filters >> a:has-text("performance")')
      .click()
    await expect(page).toHaveURL('/blog/performance/1')
  })

  test('checks all filter goes to blog with all url', async ({ page }) => {
    await page.locator('data-test-id=filters >> a:has-text("all")').click()
    await expect(page).toHaveURL('/blog/all/1')
  })
})
