import { expect, test } from '@playwright/test'

test.describe('Speaking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/speaking')
  })

  test('lists booked talks only', async ({ page }) => {
    await expect(page).toHaveTitle(/Speaking/)
    await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible()
    await expect(page.getByText(/not an open call/i)).toBeVisible()

    await expect(page.getByRole('heading', { name: /Bug Report In, Pull Request Out/ })).toBeVisible()
    await expect(page.getByText('ZurichJS Conf')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Event site' }).first()).toHaveAttribute(
      'href',
      'https://conf.zurichjs.com/speakers/debbie-o-brien',
    )

    await expect(page.getByRole('heading', { name: /The Agentic Developer/ })).toBeVisible()
    await expect(page.getByText('Infobip Shift')).toBeVisible()
    await expect(page.getByRole('link', { name: 'Event site' }).nth(1)).toHaveAttribute(
      'href',
      'https://shift.infobip.com/agenda/',
    )

    await expect(page.getByRole('link', { name: /invite me/i })).toHaveCount(0)
  })
})
