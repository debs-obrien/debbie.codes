import { expect, test } from '@playwright/test'

test.describe('Contact page', () => {
  test('is a real page without a visible email address', async ({ page }) => {
    await page.goto('/contact')

    await expect(page).toHaveURL(/\/contact\/?$/)
    await expect(page).toHaveTitle(/Contact/)
    await expect(page.getByRole('heading', { name: 'Contact', level: 1 })).toBeVisible()
    await expect(page.getByText(/not looking for a high volume of mail/i)).toBeVisible()
    await expect(page.getByRole('link', { name: /say hello/i })).toHaveAttribute(
      'href',
      'mailto:dobriendev@gmail.com',
    )
    await expect(page.getByText('dobriendev@gmail.com')).toHaveCount(0)
    await expect(page.getByRole('main').getByRole('link', { name: 'speaking', exact: true })).toHaveAttribute('href', '/speaking')
  })
})
