import { test, expect } from '@playwright/test'

test('filters in blog', async ({ page }) => {
  // Go to /
  await page.goto('')

  // Click a:has-text("Blog") >> nth=0
  await page.locator('a:has-text("Blog")').first().click()
  await expect(page).toHaveURL('/blog')
  // Click text=nuxt >> nth=1
  // await page
  //   .locator('data-test-id=filters', { has: page.locator('a:has-text("nuxt")') })
  //   .click()
  // await expect(page).toHaveURL('/blog/nuxt/1')

  // await Promise.all([
  //   page.waitForNavigation(/*{ url: '/blog/nuxt/1'}*/),
  //   page.locator('data-test-id=filters >> a:has-text("nuxt"))').click()
  // ])
  await page.locator('data-test-id=filters >> a:has-text("nuxt")').click()
  await expect(page).toHaveURL('/blog/nuxt/1')

  // Click text=react >> nth=1

  await page.locator('data-test-id=filters >> a:has-text("react")').click()
  await expect(page).toHaveURL('/blog/react/1')

  // Click a:has-text("testing") >> nth=0
  await page.locator('data-test-id=filters >> a:has-text("testing")').click()
  await expect(page).toHaveURL('/blog/testing/1')

  // Click a:has-text("javascript")
  await page.locator('data-test-id=filters >> a:has-text("javascript")').click()
  await expect(page).toHaveURL('/blog/javascript/1')

  // Click text=typescript
  await page.locator('data-test-id=filters >> a:has-text("typescript")').click()
  await expect(page).toHaveURL('/blog/typescript/1')

  // Click text=lifestyle
  await page.locator('data-test-id=filters >> a:has-text("lifestyle")').click()
  await expect(page).toHaveURL('/blog/lifestyle/1')

  // Click a:has-text("performance")
  await page
    .locator('data-test-id=filters >> a:has-text("performance")')
    .click()
  await expect(page).toHaveURL('/blog/performance/1')

  // Click a:has-text("All") >> nth=0
  await page.locator('data-test-id=filters >> a:has-text("all")').click()
  await expect(page).toHaveURL('/blog/all/1')
})
