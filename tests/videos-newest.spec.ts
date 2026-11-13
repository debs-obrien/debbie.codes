import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { buildVideosTopRow, HIDDEN_YOUTUBE_VIDEO_IDS } from '../utils/videos';
import { expect, test } from './fixtures';

const isEndform = process.env.ENDFORM === 'true';
const videosDir = join('content', 'videos');

interface VideoFrontmatter {
  title: string
  date: string
  video: string
  featured: boolean
  featuredOrder: number
}

function frontmatterValue(block: string, key: string): string | undefined {
  const match = block.match(new RegExp(`^${key}:\\s*(.+)$`, 'm'));
  if (!match)
    return undefined;
  return match[1].trim().replace(/^["']|["']$/g, '');
}

/** Derive visible videos from content/videos (excludes hard-banned YouTube IDs). */
function loadVisibleVideosFromContent(): VideoFrontmatter[] {
  if (!existsSync(videosDir))
    return [];

  const videos: VideoFrontmatter[] = [];
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
    const date = frontmatterValue(block, 'date');
    if (!videoId || !title || !date)
      continue;
    if (HIDDEN_YOUTUBE_VIDEO_IDS.has(videoId))
      continue;

    const featuredRaw = frontmatterValue(block, 'featured');
    const featuredOrderRaw = frontmatterValue(block, 'featuredOrder');
    videos.push({
      title,
      date: date.slice(0, 10),
      video: videoId,
      featured: featuredRaw === 'true',
      featuredOrder: featuredOrderRaw ? Number(featuredOrderRaw) : 99
    });
  }
  return videos;
}

test.describe('Videos newest entries from content', () => {
  test('Featured top row is Latest + featured; list has no duplicates', async ({ page }) => {
    test.skip(
      isEndform || !existsSync(videosDir),
      'content/videos is not available on Endform runners (no repo checkout)'
    );

    const all = loadVisibleVideosFromContent();
    expect(all.length, 'expected video markdown under content/videos').toBeGreaterThan(0);

    // Same selection rules as pages/videos/index.vue
    const topRow = buildVideosTopRow(all, 3);
    expect(topRow.length).toBe(3);

    const featured = [...all]
      .filter(v => v.featured)
      .sort((a, b) => a.featuredOrder - b.featuredOrder);
    const newest = [...all].sort((a, b) => b.date.localeCompare(a.date))[0]!;
    expect(topRow[0]?.video).toBe(newest.video);

    const remainingFeatured = featured.filter(v => v.video !== newest.video);
    expect(topRow[1]?.video).toBe(remainingFeatured[0]?.video);
    expect(topRow[2]?.video).toBe(remainingFeatured[1]?.video);

    const amsterdamTitle = 'The Agentic Developer: Orchestrating AI Workflows with MCPs';
    expect(topRow.map(v => v.title)).not.toContain(amsterdamTitle);

    const topRowIds = new Set(topRow.map(v => v.video));
    const latestPool = all
      .filter(v => !topRowIds.has(v.video))
      .sort((a, b) => b.date.localeCompare(a.date));

    await page.goto('/videos');
    await expect(page.getByRole('heading', { name: 'Latest', level: 2 })).toBeVisible();

    const featuredRegion = page.getByRole('region', { name: 'Featured' });
    const latestRegion = page.getByRole('region', { name: 'Latest' });

    await test.step('Top row: newest with Latest label, then featured in order', async () => {
      const cards = featuredRegion.getByRole('article');
      await expect(cards).toHaveCount(3);

      await expect(cards.nth(0).getByText('Latest', { exact: true })).toBeVisible();
      await expect(cards.nth(0).getByRole('heading')).toHaveText(topRow[0]!.title);
      await expect(cards.nth(1).getByRole('heading')).toHaveText(topRow[1]!.title);
      await expect(cards.nth(2).getByRole('heading')).toHaveText(topRow[2]!.title);

      await expect(cards.nth(1).getByText('Latest', { exact: true })).toHaveCount(0);
      await expect(cards.nth(2).getByText('Latest', { exact: true })).toHaveCount(0);
    });

    await test.step('Amsterdam talk is not in Featured but appears in Latest', async () => {
      await expect(
        featuredRegion.getByRole('heading', { name: amsterdamTitle }),
      ).toHaveCount(0);
      await expect(
        latestRegion.getByRole('heading', { name: amsterdamTitle }),
      ).toBeVisible();
    });

    await test.step('No video title appears twice on the page', async () => {
      const headings = page.locator('article h3');
      const texts = (await headings.allTextContents()).map(t => t.trim()).filter(Boolean);
      expect(new Set(texts).size).toBe(texts.length);
    });

    await test.step('Latest list excludes top-row picks and is newest-first', async () => {
      const latestArticles = latestRegion.getByRole('article');
      await expect(latestArticles).toHaveCount(24);

      const newestDate = latestPool[0]?.date;
      expect(newestDate).toBeTruthy();
      const newestTitles = latestPool.filter(v => v.date === newestDate).map(v => v.title);

      const topTitles: string[] = [];
      for (let i = 0; i < newestTitles.length; i++) {
        topTitles.push((await latestArticles.nth(i).getByRole('heading').textContent() ?? '').trim());
      }
      expect(new Set(topTitles)).toEqual(new Set(newestTitles));

      const datetimes: string[] = [];
      const sample = Math.min(8, await latestArticles.count());
      for (let i = 0; i < sample; i++) {
        const dt = await latestArticles.nth(i).locator('time').getAttribute('datetime');
        expect(dt, `article ${i} should have <time datetime>`).toBeTruthy();
        datetimes.push(dt!);
      }
      for (let i = 1; i < datetimes.length; i++) {
        expect(
          datetimes[i - 1]! >= datetimes[i]!,
          `Latest dates should be newest-first: ${datetimes[i - 1]} then ${datetimes[i]}`
        ).toBe(true);
      }
      expect(datetimes[0]).toBe(newestDate);
    });
  });
});
