import { test, expect } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test.describe('Color Picker', () => {
  test('shows page in light mode', async ({ page }) => {
    await page.locator('[aria-label="light mode"]').click()
    await expect(page.locator('text=color mode >> text=light')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'light')
  })

  test('shows page in dark mode', async ({ page }) => {
    await page.locator('[aria-label="dark mode"]').click()
    await expect(page.locator('text=color mode >> text=dark')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'dark')
  })

  test('shows page in sepia mode', async ({ page }) => {
    await page.locator('[aria-label="sepia mode"]').click()
    await expect(page.locator('text=color mode >> text=sepia')).toBeVisible()
    await expect(page.locator('html')).toHaveAttribute('class', 'sepia')
  })

  test('shows page in system mode', async ({ page }) => {
    await page.locator('[aria-label="system mode"]').click()
    await expect(page.locator('text=color mode >> text=system ')).toBeVisible()
  })
})
