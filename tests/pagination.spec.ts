import { test, expect } from '@playwright/test'

test('pagination of blog', async ({ page }) => {
  // Go to https://debbie.codes/
  await page.goto('https://debbie.codes/')

  // Click text=Blog >> nth=0
  await page.locator('text=Blog').first().click()
  await expect(page).toHaveURL('https://debbie.codes/blog')

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/2')

  // Click text=Prev page
  await page.locator('text=Prev page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/all/1')

  // Click text=Being an Imposter
  await page.locator('text=Being an Imposter').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/being-an-imposter')

  // Click h1:has-text("Being an Imposter")
  await page.locator('h1:has-text("Being an Imposter")').click()

  // Click [aria-label="Breadcrumb"] >> text=blog
  await page.locator('[aria-label="Breadcrumb"] >> text=blog').click()
  await expect(page).toHaveURL('https://debbie.codes/blog')

  // Click text=react >> nth=1
  await page.locator('text=react').nth(1).click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/1')

  // Click text=Design Tokens and Theming
  await Promise.all([
    page.waitForNavigation(/*{ url: 'https://debbie.codes/blog/react/1' }*/),
    page.locator('text=Design Tokens and Theming').click()
  ])

  // Click text=Next page
  await page.locator('text=Next page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/2')

  // Click text=Prev page
  await page.locator('text=Prev page').click()
  await expect(page).toHaveURL('https://debbie.codes/blog/react/1')
})
