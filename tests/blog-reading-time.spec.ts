import { expect, test } from './fixtures';

/**
 * Long published post: cards used to show "1 min read" because list queries
 * omit body and fell back to the short description. Card and page must match.
 */
const LONG_POST = {
  slug: 'devrel-didnt-die-its-audience-changed',
  path: '/blog/devrel-didnt-die-its-audience-changed',
  title: /DevRel Didn't Die/i,
  yearPath: '/blog/year/2026',
  tagPath: '/blog/tags/dev-rel'
};

function readingTimeFrom(text: string | null) {
  const match = text?.match(/(\d+)\s+min read/);
  return match ? Number(match[1]) : null;
}

async function cardReadingMinutes(
  page: import('@playwright/test').Page,
  listPath: string
) {
  await page.goto(listPath);
  const card = page.locator('article').filter({
    has: page.locator(`a[href="${LONG_POST.path}"]`)
  }).first();
  await expect(card.getByRole('heading', { name: LONG_POST.title })).toBeVisible();
  // Prefer the dedicated reading-time node so date textContent cannot glue
  // onto minutes (e.g. "2026" + "14 min read" → "202614").
  const label = card.getByText(/\d+\s+min read/).first();
  await expect(label).toBeVisible();
  const minutes = readingTimeFrom(await label.textContent());
  expect(minutes, `${listPath} card should show a reading time`).not.toBeNull();
  expect(minutes!, `${listPath} long post must not fall back to description (1 min)`).toBeGreaterThan(1);
  return minutes!;
}

test('long post card and page show the same reading time', async ({ page }) => {
  const blogCardMinutes = await cardReadingMinutes(page, '/blog');
  const yearCardMinutes = await cardReadingMinutes(page, LONG_POST.yearPath);
  const tagCardMinutes = await cardReadingMinutes(page, LONG_POST.tagPath);
  expect(yearCardMinutes).toBe(blogCardMinutes);
  expect(tagCardMinutes).toBe(blogCardMinutes);

  await page.goto('/');
  const homeCard = page.locator('article').filter({
    has: page.locator(`a[href="${LONG_POST.path}"]`)
  }).first();
  // Home only shows the newest posts; skip if this slug has scrolled off.
  if (await homeCard.count()) {
    const homeLabel = homeCard.getByText(/\d+\s+min read/).first();
    const homeMinutes = readingTimeFrom(await homeLabel.textContent());
    expect(homeMinutes).toBe(blogCardMinutes);
  }

  await page.goto(LONG_POST.path);
  await expect(page.getByRole('heading', { name: LONG_POST.title })).toBeVisible();
  const pageMinutes = readingTimeFrom(await page.getByText(/\d+\s+min read/).first().textContent());
  expect(pageMinutes, 'post page should show a reading time').not.toBeNull();
  expect(pageMinutes).toBe(blogCardMinutes);
});
