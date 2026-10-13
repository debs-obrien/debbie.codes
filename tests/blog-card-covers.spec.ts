import { expect, test } from '@playwright/test'

const COVER_POST = 'grok-bot-does-my-shopping'

for (const path of ['/', '/blog']) {
  test(`blog cards on ${path} show a lazy 2:1 cover only for posts with an image`, async ({ page }) => {
    await page.goto(path)
    const card = page.locator('article').filter({ has: page.locator(`a[href="/blog/${COVER_POST}"]`) }).first()
    await card.scrollIntoViewIfNeeded()
    const cover = card.getByTestId('blog-card-cover').locator('img')
    await expect(cover).toBeVisible()
    await expect(cover).toHaveAttribute('loading', 'lazy')
    await expect(cover).toHaveAttribute('alt', '')
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    const box = await cover.boundingBox()
    expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05)

    // Cards for posts without an image have no cover and no placeholder.
    const articles = page.locator('article')
    const total = await articles.count()
    const withCover = await articles.filter({ has: page.getByTestId('blog-card-cover') }).count()
    expect(withCover).toBeGreaterThan(0)
    expect(withCover).toBeLessThanOrEqual(total)
  })
}
