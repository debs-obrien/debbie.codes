import { expect, test } from '@playwright/test'

// Newest post: on home recent posts and /blog (as the lead card)
const COVER_POST = 'grok-bot-explained'
/** First/featured post on /blog (lead) and near the top of home recent posts. */
const LEAD_COVER_POST = 'grok-bot-explained'
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
    await expectCardCover(page, COVER_POST, /224px|400px|640px|896px|320px/)
  })
}

test('featured lead card on /blog uses a compact side cover on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/blog')
  const { withCoverCard, box } = await expectCardCover(page, LEAD_COVER_POST, /320px|640px/)
  // Lead cover is a fixed-width side thumb (sm:w-80), same card family as compact.
  expect(box!.width).toBeGreaterThan(300)
  expect(box!.width).toBeLessThan(340)
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05)
  // Side layout: cover and text share a horizontal flex row (sm:flex on the lead shell).
  const shell = withCoverCard.locator('div.sm\\:flex').first()
  await expect(shell).toHaveClass(/sm:flex/)
  await expect(shell).toHaveClass(/sm:items-center/)
  const titleBox = await withCoverCard.locator('h3').boundingBox()
  expect(titleBox!.x).toBeGreaterThan(box!.x + box!.width - 1)

  // Title, excerpt, and meta share one left edge (no arrow indent).
  const excerptBox = await withCoverCard.locator('p').first().boundingBox()
  const metaBox = await withCoverCard.locator('.text-xs').first().boundingBox()
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2)
  expect(Math.abs(titleBox!.x - metaBox!.x)).toBeLessThan(2)

  // Lead meta is date + reading time only — no tags.
  await expect(withCoverCard.locator('a[href*="/blog/tags/"]')).toHaveCount(0)
})

test('featured lead card on /blog caps cover height on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/blog')
  const { withCoverCard, box } = await expectCardCover(page, LEAD_COVER_POST, /320px|640px/)
  expect(box!.height).toBeLessThanOrEqual(180)
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05)
  // Stacked on mobile: cover sits above the title, full card width (not a 320px side thumb).
  expect(box!.width).toBeGreaterThan(250)
  const title = withCoverCard.locator('h3')
  const titleBox = await title.boundingBox()
  expect(titleBox!.y).toBeGreaterThan(box!.y + box!.height - 1)
  await expect(title).toHaveCSS('text-align', 'left')
  const excerptBox = await withCoverCard.locator('p').first().boundingBox()
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2)
})

test('compact cards on /blog flush title with excerpt (no arrow indent)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/blog')
  // Second article is a compact (non-lead) card.
  const compact = page.locator('article').nth(1)
  await compact.scrollIntoViewIfNeeded()
  const titleBox = await compact.locator('h3').boundingBox()
  const excerptBox = await compact.locator('p').first().boundingBox()
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2)
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

test('lead and compact cards gate the side column on image (no empty cover column)', async ({ page }) => {
  // Lead with cover gets the side layout; no-cover cards omit the cover node and sm:flex.
  // Forcing a no-cover lead via Nuxt payload rewrite is impractical with the packed SSR payload.
  await page.setViewportSize({ width: 1280, height: 800 })
  await page.goto('/blog')
  const lead = page.locator('article').filter({
    has: page.locator(`a[href="/blog/${LEAD_COVER_POST}"]`),
  }).first()
  await expect(lead.getByTestId('blog-card-cover')).toHaveCount(1)
  await expect(lead.locator('div.sm\\:flex').first()).toHaveClass(/sm:flex/)

  await page.goto('/blog/year/2025')
  const noCover = page.locator('article').filter({
    has: page.locator(`a[href="/blog/${NO_COVER_POST}"]`),
  }).first()
  await expect(noCover.getByTestId('blog-card-cover')).toHaveCount(0)
  await expect(noCover.locator('img')).toHaveCount(0)
  await expect(noCover.locator('a').first()).not.toHaveClass(/sm:flex/)
})
