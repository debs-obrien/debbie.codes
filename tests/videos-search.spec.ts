import { expect, test } from '@playwright/test'

/**
 * Helper: fill the search input and wait for Vue search to activate.
 * Nuxt SSR hydration may not be complete when the input first appears,
 * so we retry fill + verify until the "Search Results" heading is visible.
 */
async function searchFor(page: import('@playwright/test').Page, term: string) {
  const searchInput = page.getByPlaceholder('Search...')
  await expect(async () => {
    await searchInput.fill(term)
    await expect(page.getByRole('heading', { name: /Search Results/ })).toBeVisible()
  }).toPass({ timeout: 10_000 })
}

test.describe('Videos Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/videos')
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Latest' }).getByRole('article').first()).toBeVisible()
  })

  test('matching term filters Latest results', async ({ page, isMobile }) => {
    if (isMobile)
      return

    const latest = page.getByRole('region', { name: 'Latest' })
    const firstTitle = (await latest.getByRole('article').first().getByRole('heading').innerText()).trim()
    // Use a distinctive token from the title so we do not match every card.
    const term = firstTitle.split(/\s+/).find(w => w.length > 4) || firstTitle

    await searchFor(page, term)

    const results = page.getByRole('region', { name: /Search Results/ })
    await expect(results.getByRole('heading', { level: 2 })).toHaveText(/Search Results \(\d+\)/)
    await expect(results.getByRole('article').filter({ hasText: firstTitle })).not.toHaveCount(0)
    await expect(results.getByRole('article').first()).toBeVisible()
  })

  test('no-match search shows Search Results (0)', async ({ page, isMobile }) => {
    if (isMobile)
      return

    const searchInput = page.getByPlaceholder('Search...')
    await expect(async () => {
      await searchInput.fill('xyz123nonexistent')
      await expect(page.getByRole('heading', { name: /Search Results \(0\)/ })).toBeVisible()
    }).toPass({ timeout: 10_000 })

    await expect(page.getByRole('region', { name: /Search Results \(0\)/ }).getByRole('article')).toHaveCount(0)
  })

  test('clearing search restores Latest', async ({ page, isMobile }) => {
    if (isMobile)
      return

    const initialCount = await page.getByRole('region', { name: 'Latest' }).getByRole('article').count()

    await searchFor(page, 'playwright')
    await expect(page.getByRole('heading', { name: /Search Results/ })).toBeVisible()

    const searchInput = page.getByPlaceholder('Search...')
    await searchInput.clear()
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible()
    await expect(page.getByRole('region', { name: 'Latest' }).getByRole('article')).toHaveCount(initialCount)
  })
})
