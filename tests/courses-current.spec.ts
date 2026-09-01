import { expect, test } from '@playwright/test'

test.describe('Current courses', () => {
  test('lists Playwright and agent courses ahead of the archive', async ({ page }) => {
    await page.goto('/courses')

    await expect(page.getByRole('heading', { name: 'Learn Agent Skills' })).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Playwright Movies App' })).toBeVisible()
    await expect(page.getByRole('heading', { name: /Let.s Learn MCP/ })).toBeVisible()

    const movies = page.getByRole('article').filter({ hasText: 'Playwright Movies App' })
    await expect(movies.getByRole('img', { name: 'Playwright Movies App' })).toBeVisible()
    await expect(movies.getByRole('link', { name: 'Playwright Movies App' }).first()).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/playwright-movies-app',
    )
  })
})
