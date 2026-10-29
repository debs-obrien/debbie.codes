import { expect, test } from './fixtures';

// Newest post: on home recent posts and /blog (as the lead card)
const COVER_POST = 'grok-bot-uploads-my-youtube-videos';
/** First/featured post on /blog (lead) and near the top of home recent posts. */
const LEAD_COVER_POST = 'grok-bot-uploads-my-youtube-videos';
/** Also on home recent posts (second-newest batch). */
const HOME_COVER_POST = 'grok-bot-50th-birthday-photo-video';

async function expectCardCover(page: import('@playwright/test').Page, slug: string, sizesPattern: RegExp, loading: 'lazy' | 'eager' = 'lazy') {
  const withCoverCard = page.locator('article').filter({ has: page.locator(`a[href="/blog/${slug}"]`) }).first();
  await withCoverCard.scrollIntoViewIfNeeded();
  const cover = withCoverCard.getByTestId('blog-card-cover').locator('img');
  await expect(cover).toBeVisible();
  await expect(cover).toHaveAttribute('loading', loading);
  await expect(cover).toHaveAttribute('alt', '');
  // Nuxt Image breakpoint sizes (not raw CSS media queries) so srcset is usable.
  await expect(cover).toHaveAttribute('sizes', sizesPattern);
  const srcset = await cover.getAttribute('srcset');
  expect(srcset, 'srcset should include real widths, not 1w/2w stubs').toMatch(/\b(2\d{2}|[4-9]\d{2}|[1-9]\d{3})w\b/);
  await expect.poll(() => cover.evaluate((img: HTMLImageElement) => img.complete && img.naturalWidth > 0)).toBe(true);
  const naturalWidth = await cover.evaluate((img: HTMLImageElement) => img.naturalWidth);
  expect(naturalWidth).toBeGreaterThan(100);
  const box = await cover.boundingBox();
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05);
  return { withCoverCard, cover, box };
}

// First few list covers load eagerly (above the fold); lead on /blog is also eager/high.
for (const [path, loading] of [['/', 'eager'], ['/blog', 'eager']] as const) {
  test(`blog cards on ${path} show a ${loading} 2:1 cover for posts with an image`, async ({ page }) => {
    await page.goto(path);
    await expectCardCover(page, COVER_POST, /224px|400px|640px|896px|320px/, loading);
  });
}

test('featured lead card on /blog uses a compact side cover on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/blog');
  const { withCoverCard, box } = await expectCardCover(page, LEAD_COVER_POST, /320px|640px/, 'eager');
  // Lead cover is a fixed-width side thumb (sm:w-80), same card family as compact.
  expect(box!.width).toBeGreaterThan(300);
  expect(box!.width).toBeLessThan(340);
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05);
  // Side layout: cover and text share a horizontal flex row (sm:flex on the lead shell).
  const shell = withCoverCard.locator('div.sm\\:flex').first();
  await expect(shell).toHaveClass(/sm:flex/);
  await expect(shell).toHaveClass(/sm:items-center/);
  const titleBox = await withCoverCard.locator('h3').boundingBox();
  expect(titleBox!.x).toBeGreaterThan(box!.x + box!.width - 1);

  // Title, excerpt, and meta share one left edge (no arrow indent).
  const excerptBox = await withCoverCard.locator('p').first().boundingBox();
  const metaBox = await withCoverCard.locator('.text-xs').first().boundingBox();
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2);
  expect(Math.abs(titleBox!.x - metaBox!.x)).toBeLessThan(2);

  // Lead meta is date + reading time only — no tags.
  await expect(withCoverCard.locator('a[href*="/blog/tags/"]')).toHaveCount(0);
});

test('featured lead card on /blog caps cover height on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');
  const { withCoverCard, box } = await expectCardCover(page, LEAD_COVER_POST, /320px|640px/, 'eager');
  expect(box!.height).toBeLessThanOrEqual(180);
  expect(Math.abs(box!.width / box!.height - 2)).toBeLessThan(0.05);
  // Stacked on mobile: cover sits above the title, full card width (not a 320px side thumb).
  expect(box!.width).toBeGreaterThan(250);
  const title = withCoverCard.locator('h3');
  const titleBox = await title.boundingBox();
  expect(titleBox!.y).toBeGreaterThan(box!.y + box!.height - 1);
  await expect(title).toHaveCSS('text-align', 'left');
  const excerptBox = await withCoverCard.locator('p').first().boundingBox();
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2);
});

test('compact cards on /blog flush title with excerpt (no arrow indent)', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/blog');
  // Second article is a compact (non-lead) card.
  const compact = page.locator('article').nth(1);
  await compact.scrollIntoViewIfNeeded();
  const titleBox = await compact.locator('h3').boundingBox();
  const excerptBox = await compact.locator('p').first().boundingBox();
  expect(Math.abs(titleBox!.x - excerptBox!.x)).toBeLessThan(2);
});

test('home recent posts include a 2:1 cover for the birthday post', async ({ page }) => {
  await page.goto('/');
  await expectCardCover(page, HOME_COVER_POST, /224px|400px/, 'eager');
});
