import { expect, test } from '@playwright/test'

// Newest post: on home recent posts and /blog (as the lead card)
const COVER_POST = 'grok-bot-uploads-my-youtube-videos'
/** First/featured post on /blog (lead) and near the top of home recent posts. */
const LEAD_COVER_POST = 'grok-bot-uploads-my-youtube-videos'
/** Also on home recent posts (second-newest batch). */
const HOME_COVER_POST = 'grok-bot-50th-birthday-photo-video'
// Excluded from cover batches; appears on /blog/year/2025 (not on home /blog recent lists)
const NO_COVER_POST = 'laid-off-what-now'

async function expectCardCover(page: import('@playwright/test').Page, slug: string, sizesPattern: RegExp) {
  const withCoverCard = page.locator('article').filter({ has: page.locator(`a[href="/blog/${slug}"]`) }).first()
  await withCoverCard.scrollIntoViewIfNeeded()
  const cover = withCoverCard.getByTestId('blog-card-cover').locator('img')
  await expect(cover).toBeVisible()
  await expect(cover).toHaveAttribute('loading', 'lazy')
  await expect(cover).toHaveAttribute('alt', '')
  // Nuxt Image breakpoint sizes (not raw CSS media queries) so srcset is usable.
  await expect(cover).toHaveAttribute('sizes', sizesPattern)
  const srcset = await cover.getAttribute('srcset')
  expect(srcset, 'srcset should include real widths, not 1w/2w stubs').toMatch(/\b(2\d{2}|[4-9]\d{2}|[1-9]\d{3})w\b/)
  await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true)
  const naturalWidth = await cover.evaluate((img: HTMLImageElement) => img.naturalWidth)
  expect(naturalWidth).toBeGreaterThan(100)
  const box = await cover.boundingBox()
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05)
  return { withCoverCard, cover, box }
}

for (const path of ['/', '/blog']) {
  test(`blog cards on ${path} show a lazy 2:1 cover for posts with an image`, async ({ page }) => {
    await page.goto(path)
    await expectCardCover(page, COVER_POST, /224px|400px|640px|896px/)
  })
}

test('featured lead card on /blog shows a full-width 2:1 cover', async ({ page }) => {
  await page.goto('/blog')
  const { withCoverCard, box } = await expectCardCover(page, LEAD_COVER_POST, /640px|896px/)
  // Lead cover is full-width above the title (not the compact side thumbnail).
  expect(box!.width).toBeGreaterThan(400)
  const link = withCoverCard.locator(`a[href="/blog/${LEAD_COVER_POST}"]`).first()
  await expect(link).not.toHaveClass(/sm:flex/)
})

test('home recent posts include a 2:1 cover for the birthday post', async ({ page }) => {
  await page.goto('/')
  await expectCardCover(page, HOME_COVER_POST, /224px|400px/)
})

test('blog cards without an image have no cover and no placeholder', async ({ page }) => {
  await page.goto('/blog/year/2025')

  const withoutCoverCard = page.locator('article').filter({ has: page.locator(`a[href="/blog/${NO_COVER_POST}"]`) }).first()
  await expect(withoutCoverCard).toBeVisible()
  await expect(withoutCoverCard.getByTestId('blog-card-cover')).toHaveCount(0)
  await expect(withoutCoverCard.locator('img')).toHaveCount(0)
})
