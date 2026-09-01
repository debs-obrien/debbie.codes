import { expect, test } from '@playwright/test'

test.describe('Now page', () => {
  test('shows current work and how to reach Debbie', async ({ page }) => {
    await page.goto('/now')

    await expect(page).toHaveTitle(/Now/)
    await expect(page.getByRole('heading', { name: /What I.m doing now/, level: 1 })).toBeVisible()
    await expect(page.getByText(/open to connections/i)).toBeVisible()
    await expect(page.getByText(/Zephyr Cloud contract has ended/)).toBeVisible()
    await expect(page.getByRole('link', { name: 'dobriendev@gmail.com' })).toHaveAttribute(
      'href',
      'mailto:dobriendev@gmail.com',
    )
    await expect(page.getByRole('link', { name: 'ZurichJS and Infobip Shift' })).toHaveAttribute('href', '/speaking')
  })
})
