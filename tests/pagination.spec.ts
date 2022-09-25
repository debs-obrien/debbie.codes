import { test, expect } from '@playwright/test'

test.describe('Previous and Next', () => {
  test('checks next page goes to next page', async ({ page }) => {
    await page.goto('/blog')
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/2')
    await page.goto('/blog/all/2', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/3')
    await page.goto('/blog/all/3', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/4')
    await page.goto('/blog/all/4', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/5')
    await page.goto('/blog/all/5', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/6')
    await page.goto('/blog/all/6', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/all/7')
    await page.goto('/blog/all/7', { timeout: 20000 })
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('checks previous page goes to previous page', async ({ page }) => {
    await page.goto('/blog/all/7')
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/6')
    await page.goto('/blog/all/6', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/5')
    await page.goto('/blog/all/5', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/4')
    await page.goto('/blog/all/4', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/3')
    await page.goto('/blog/all/3', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/all/2')
    await page.goto('/blog/all/1', { timeout: 20000 })
    await expect(page.locator('text=Prev page')).not.toBeVisible()
  })

  test('nuxt next page should go to next page', async ({ page }) => {
    await page.goto('/blog/nuxt/1', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/nuxt/2')
    await page.goto('/blog/nuxt/2', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/nuxt/3')
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('nuxt prev page should go to prev page', async ({ page }) => {
    await page.goto('/blog/nuxt/3', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/nuxt/2')
    await page.goto('/blog/nuxt/2', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/nuxt/1')
    await expect(page.locator('text=Prev page')).not.toBeVisible()
  })

  test('react next page should go to next page', async ({ page }) => {
    await page.goto('/blog/react/1', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/react/2')
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('react prev page should go to prev page', async ({ page }) => {
    await page.goto('/blog/react/2', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/react/1')
    await expect(page.locator('text=Prev page')).not.toBeVisible()
  })

  test('testing next page should not have next page', async ({ page }) => {
    await page.goto('/blog/testing/1', { timeout: 20000 })
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('javascript next page should not have next page', async ({ page }) => {
    await page.goto('/blog/javascript/1', { timeout: 20000 })
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('typescript next page should not have next page', async ({ page }) => {
    await page.goto('/blog/typescript/1', { timeout: 20000 })
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('performance next page should not have next page', async ({ page }) => {
    await page.goto('/blog/performance/1', { timeout: 20000 })
    await expect(page.locator('text=Next page')).not.toBeVisible()
  })

  test('lifestyle next page should go to next page', async ({ page }) => {
    await page.goto('/blog/lifestyle/1', { timeout: 20000 })
    await page.locator('text=Next page').click()
    await expect(page).toHaveURL('/blog/lifestyle/2')
  })

  test('lifestyle prev page should go to prev page', async ({ page }) => {
    await page.goto('/blog/lifestyle/2', { timeout: 20000 })
    await page.locator('text=Prev page').click()
    await expect(page).toHaveURL('/blog/lifestyle/1')
    await expect(page.locator('text=Prev page')).not.toBeVisible()
  })
})
