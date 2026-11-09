import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { HIDDEN_YOUTUBE_VIDEO_IDS } from '../utils/videos';
import { expect, test } from './fixtures';

const isEndform = process.env.ENDFORM === 'true';
const videosDir = join('content', 'videos');

interface VideoSearchRow {
  title: string
  description: string
  tags: string[]
  video: string
}

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match)
    return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

function parseTags(block: string): string[] {
  const inline = block.match(/^tags:\s*\[([^\]]*)\]/m);
  if (inline) {
    return inline[1]
      .split(',')
      .map(s => s.trim().replace(/^["']|["']$/g, ''))
      .filter(Boolean);
  }
  return [];
}

/** Visible videos from content/videos (excludes hard-banned YouTube IDs). */
function loadVisibleVideosFromContent(): VideoSearchRow[] {
  if (!existsSync(videosDir))
    return [];

  const videos: VideoSearchRow[] = [];
  for (const file of readdirSync(videosDir)) {
    if (!file.endsWith('.md'))
      continue;
    const raw = readFileSync(join(videosDir, file), 'utf8');
    const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
    if (!fmMatch)
      continue;
    const block = fmMatch[1];
    const videoId = frontmatterValue(block, 'video')?.trim();
    const title = frontmatterValue(block, 'title');
    if (!videoId || !title)
      continue;
    if (HIDDEN_YOUTUBE_VIDEO_IDS.has(videoId))
      continue;
    videos.push({
      title,
      description: frontmatterValue(block, 'description') ?? '',
      tags: parseTags(block),
      video: videoId
    });
  }
  return videos;
}

/** Same match rules as components/BlogSearch.vue (title | description | tags). */
function matchesSearch(video: VideoSearchRow, query: string): boolean {
  const q = query.toLowerCase().trim();
  if (!q)
    return true;
  if (video.title.toLowerCase().includes(q))
    return true;
  if (video.description.toLowerCase().includes(q))
    return true;
  return video.tags.some(tag => tag.toLowerCase().includes(q));
}

/**
 * Prefer a content-derived query that matches a proper subset of videos
 * (at least one hit, at least one miss) so exclusion can be asserted.
 */
function pickSearchCase(videos: VideoSearchRow[]): { query: string, matches: VideoSearchRow[], nonMatches: VideoSearchRow[] } | null {
  // Prefer a unique full title (almost always a proper subset).
  for (const candidate of videos) {
    const query = candidate.title;
    const matches = videos.filter(v => matchesSearch(v, query));
    const nonMatches = videos.filter(v => !matchesSearch(v, query));
    if (matches.length > 0 && nonMatches.length > 0)
      return { query, matches, nonMatches };
  }
  return null;
}

/**
 * Helper: fill the search input and wait for Vue search to activate.
 * Nuxt SSR hydration may not be complete when the input first appears,
 * so we retry fill + verify until the "Search Results" heading is visible.
 */
async function searchFor(page: import('@playwright/test').Page, term: string) {
  const searchInput = page.getByPlaceholder('Search...');
  await expect(async () => {
    await searchInput.fill(term);
    await expect(page.getByRole('heading', { name: /Search Results/ })).toBeVisible();
  }).toPass({ timeout: 10_000 });
}

test.describe('Videos Search Functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/videos');
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Latest' }).getByRole('article').first()).toBeVisible();
  });

  test('matching term filters Latest results', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Videos search UI is desktop-only in these specs');
    test.skip(
      isEndform || !existsSync(videosDir),
      'content/videos is not available on Endform runners (no repo checkout)'
    );

    const videos = loadVisibleVideosFromContent();
    expect(videos.length, 'expected video markdown under content/videos').toBeGreaterThan(1);

    const searchCase = pickSearchCase(videos);
    expect(searchCase, 'need a query with both matches and non-matches').toBeTruthy();
    const { query, matches, nonMatches } = searchCase!;

    await searchFor(page, query);

    const results = page.getByRole('region', { name: /Search Results/ });
    await expect(results.getByRole('heading', { level: 2 })).toHaveText(
      new RegExp(`Search Results \\(${matches.length}\\)`)
    );
    await expect(results.getByRole('article')).toHaveCount(matches.length);

    const resultTitles = (await results.getByRole('article').getByRole('heading').allTextContents())
      .map(t => t.trim());
    expect(new Set(resultTitles)).toEqual(new Set(matches.map(m => m.title)));
    expect(resultTitles.some(t => nonMatches.some(m => m.title === t))).toBe(false);
  });

  test('no-match search shows Search Results (0)', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Videos search UI is desktop-only in these specs');

    const searchInput = page.getByPlaceholder('Search...');
    await expect(async () => {
      await searchInput.fill('xyz123nonexistent');
      await expect(page.getByRole('heading', { name: /Search Results \(0\)/ })).toBeVisible();
    }).toPass({ timeout: 10_000 });

    await expect(page.getByRole('region', { name: /Search Results \(0\)/ }).getByRole('article')).toHaveCount(0);
  });

  test('clearing search restores Latest', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Videos search UI is desktop-only in these specs');

    const initialCount = await page.getByRole('region', { name: 'Latest' }).getByRole('article').count();

    await searchFor(page, 'playwright');
    await expect(page.getByRole('heading', { name: /Search Results/ })).toBeVisible();

    const searchInput = page.getByPlaceholder('Search...');
    await searchInput.clear();
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible();
    await expect(page.getByRole('region', { name: 'Latest' }).getByRole('article')).toHaveCount(initialCount);
  });
});
