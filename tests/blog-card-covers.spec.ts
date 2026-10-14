import { expect, test } from '@playwright/test'

const COVER_POST = 'grok-bot-does-my-shopping'
const NO_COVER_POST = 'talk-to-my-bots-through-alexa'

for (const path of ['/', '/blog']) {
  test(`blog cards on ${path} show a lazy 2:1 cover only for posts with an image`, async ({ page }) => {
    await page.goto(path)

    const withCoverCard = page.locator('article').filter({ has: page.locator(`a[href="/blog/${COVER_POST}"]`) }).first()
    await withCoverCard.scrollIntoViewIfNeeded()
    const cover = withCoverCard.getByTestId('blog-card-cover').locator('img')
    await expect(cover).toBeVisible()
    await expect(cover).toHaveAttribute('loading', 'lazy')
    await expect(cover).toHaveAttribute('alt', '')
    // Nuxt Image breakpoint sizes (not raw CSS media queries) so srcset is usable.
    await expect(cover).toHaveAttribute('sizes', /224px|400px|640px|896px/)
    const srcset = await cover.getAttribute('srcset')
    expect(srcset, 'srcset should include real widths, not 1w/2w stubs').toMatch(/\b(2\d{2}|[4-9]\d{2}|[1-9]\d{3})w\b/)
    await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
    const naturalWidth = await cover.evaluate((img: HTMLImageElement) => img.naturalWidth)
    expect(naturalWidth).toBeGreaterThan(100)
    const box = await cover.boundingBox()
    expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05)

    // Cards for posts without an image have no cover and no placeholder.
    const withoutCoverCard = page.locator('article').filter({ has: page.locator(`a[href="/blog/${NO_COVER_POST}"]`) }).first()
    await expect(withoutCoverCard).toBeVisible()
    await expect(withoutCoverCard.getByTestId('blog-card-cover')).toHaveCount(0)
    await expect(withoutCoverCard.locator('img')).toHaveCount(0)
  })
}
