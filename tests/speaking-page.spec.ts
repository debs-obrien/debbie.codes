import { expect, test } from '@playwright/test'

test.describe('Speaking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/speaking')
  })

  test('shows empty upcoming and past-talk resources', async ({ page }) => {
    await expect(page).toHaveTitle(/Speaking/)
    await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible()
    await expect(page.getByText(/I speak about Playwright/i)).toBeVisible()
    await expect(page.getByText(/workshop/i)).toHaveCount(0)
    await expect(page.getByText(/already take/i)).toHaveCount(0)

    await expect(page.getByRole('heading', { name: 'Upcoming', level: 2 })).toBeVisible()
    await expect(page.getByText('No upcoming talks listed — see conference videos / decks below.')).toBeVisible()
    await expect(page.getByText('ZurichJS Conf')).toHaveCount(0)
    await expect(page.getByText('Infobip Shift')).toHaveCount(0)
    await expect(page.getByText(/The Agentic Developer/)).toHaveCount(0)
    await expect(page.getByRole('link', { name: 'Infobip Shift agenda' })).toHaveCount(0)

    await expect(page.getByRole('link', { name: /invite me/i })).toHaveCount(0)

    await expect(page.getByRole('link', { name: 'conference videos' })).toHaveAttribute(
      'href',
      '/videos/tags/conference-talk',
    )

    const decksLink = page.getByRole('link', { name: 'slide decks on GitHub' })
    await expect(decksLink).toBeVisible()
    await expect(decksLink).toHaveAttribute('href', 'https://github.com/debs-obrien/decks')
    await expect(decksLink).toHaveAttribute('target', '_blank')
    await expect(decksLink).toHaveAttribute('rel', 'noopener noreferrer')

    await expect(page.getByRole('link', { name: 'email me' })).toHaveAttribute(
      'href',
      'mailto:dobriendev@gmail.com',
    )
  })
})
