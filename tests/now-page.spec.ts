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
    await expect(page.getByText(/applied AI, developer experience, and Playwright/)).toBeVisible()
    await expect(page.getByText(/writing and recording about AI agents, MCP, and Playwright/)).toBeVisible()

    const teaching = page.locator('section').filter({ has: page.getByRole('heading', { name: 'Teaching' }) })
    await expect(teaching.getByRole('link').nth(0)).toHaveAttribute('href', 'https://github.com/debs-obrien/learn-agent-skills')
    await expect(teaching.getByRole('link').nth(1)).toHaveAttribute('href', 'https://www.youtube.com/watch?v=AKjW94vQZkc')
    await expect(teaching.getByRole('link').nth(2)).toHaveAttribute('href', 'https://github.com/debs-obrien/playwright-movies-app')
  })
})
