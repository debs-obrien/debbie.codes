import { expect, test } from '@playwright/test'

test.describe('performance and accessibility guards', () => {
  test('canonical no-slash URLs are served without a redirect', async ({ request }) => {
    for (const path of ['/blog', '/videos', '/blog/grok-bot-explained']) {
      const response = await request.get(path, { maxRedirects: 0 })
      expect(response.status(), path).toBe(200)
    }
  })

  test('top-bar photo is decorative so the link name is not repeated', async ({ page }) => {
    await page.goto('/blog')
    await expect(page.getByRole('banner').locator('img.profile-pic')).toHaveAttribute('alt', '')
    await expect(page.getByRole('banner').getByRole('link', { name: 'Debbie O\'Brien', exact: true })).toBeVisible()
  })

  test('post dates and prev/next links meet contrast and label-in-name', async ({ page }) => {
    await page.goto('/blog/grok-bot-explained')
    // text-gray-600 in light mode: 4.5:1+ on the page background
    await expect(page.locator('article header time').first()).toHaveCSS('color', 'rgb(75, 85, 99)')
    const prevNext = page.getByRole('navigation', { name: 'Blog post navigation' }).getByRole('link')
    await expect(prevNext.first()).not.toHaveAttribute('aria-label', /.*/)
    await expect(page.getByRole('link', { name: /^(Previous|Next) post: / }).first()).toBeVisible()
  })
})
