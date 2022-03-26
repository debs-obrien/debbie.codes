import { test, expect } from '@playwright/test'

test('test', async ({ page }) => {
  // Go to https://debbie.codes/
  await page.goto('https://debbie.codes/')

  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')

  // Click text=nuxt >> nth=1
  await page.locator('text=nuxt').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/nuxt/1')

  // Click text=Pagination in Nuxt Content
  await page.locator('text=Pagination in Nuxt Content').click()
  await expect(page).toHaveURL(
    'https://debbie.codes/blog/pagination-in-nuxt-content'
  )

  // Click text=Home blog Pagination in Nuxt Content Pagination in Nuxt Content Nuxt content is
  await page
    .locator(
      'text=Home blog Pagination in Nuxt Content Pagination in Nuxt Content Nuxt content is '
    )
    .click()

  // Click [aria-label="Breadcrumb"] >> text=blog
  await page.locator('[aria-label="Breadcrumb"] >> text=blog').click()
  await expect(page).toHaveURL('https://debbie.codes/blog')

  // Click text=Next page
  await page.locator('#prev-next').locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/2')

  // Click text=nuxt >> nth=1
  await page.locator('text=nuxt').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/nuxt/1')
  await page.locator('Pagination in Nuxt Content')

  // Click a:has-text("react")
  await page.locator('a:has-text("react")').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/1')

  // Click text=Next page
  await page.locator('#prev-next').locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/2')
  await page.locator('text=Learning React')

  // Click text=All >> nth=1
  await page.locator('text=All').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/1')

  // Click text=Next page
  await page.locator('#prev-next').locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/2')

  // Click text=dev stuff
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://debbie.codes/blog/dev%20stuff/1' }*/),
    page.locator('text=dev stuff').click()
  ])

  // Click text=typescript >> nth=0
  await page.locator('text=typescript').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog/typescript/1')

  // Click text=javascript >> nth=1
  await page.locator('text=javascript').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/javascript/1')

  // Click a:has-text("testing")
  await page.locator('a:has-text("testing")').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/testing/1')
})
