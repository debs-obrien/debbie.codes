import { test, expect } from '@playwright/test'

test.describe('Videos pagination', () => {
  test('lists a page of videos and links to older pages', async ({ page }) => {
    await page.goto('/videos')

    await expect(page.getByRole('heading', { name: 'Videos', level: 1 })).toHaveText('Videos')
    await expect(page.getByRole('article')).toHaveCount(24)

    const next = page.getByRole('link', { name: /next/i })
    await expect(next).toHaveAttribute('href', /\/videos\/page\/2/)
    await next.click()
    await expect(page).toHaveURL(/\/videos\/page\/2\/?$/)
    await expect.poll(() => page.getByRole('article').count()).toBeGreaterThan(0)
  })

  test('redirects /videos/all to /videos', async ({ page }) => {
    await page.goto('/videos/all')
    await expect(page).toHaveURL(/\/videos\/?$/)
  })
})
