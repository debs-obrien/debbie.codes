import { expect, test } from '@playwright/test';
import { buildVideosResponse } from '../utils/webmcp/response';
import { MAX_OUTPUT_CHARS, webmcpTools } from '../utils/webmcp/tools';

const expected = Object.values(webmcpTools).map(t => t.name).sort();
const listVideos = webmcpTools.listVideos;

async function waitForWebmcpTools(page: import('@playwright/test').Page) {
  await expect.poll(async () => {
    try {
      return (await page.webmcp.tools()).map(t => t.name).sort();
    }
    catch (error) {
      // Dev-server HMR / soft navigations can destroy the context mid-poll.
      if (String(error).includes('Execution context was destroyed'))
        return [];
      throw error;
    }
  }, { timeout: 20000 }).toEqual(expected);
}

test.describe('WebMCP list-videos', () => {
  test.describe.configure({ mode: 'serial' });

  // Endform's cloud runners do not expose Playwright's page.webmcp API yet
  // (page.webmcp is undefined → TypeError on .tools()). GHA + Netlify preview
  // still run these with --enable-features=WebMCP.
  test.skip(() => process.env.ENDFORM === 'true', 'Endform runners do not expose page.webmcp');

  test.beforeEach(async ({ page }) => {
    test.skip(!page.webmcp, 'page.webmcp unavailable in this browser');
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    await waitForWebmcpTools(page);
  });

  test('registers list-videos with schema and readOnly hint', async ({ page }) => {
    const tool = (await page.webmcp.tools()).find(t => t.name === 'list-videos');
    expect(tool).toBeTruthy();
    expect(tool!.name.length).toBeLessThanOrEqual(30);
    expect(tool!.description.length).toBeLessThanOrEqual(500);
    expect(tool!.description).toBe(listVideos.description);
    expect(tool!.inputSchema).toEqual(listVideos.inputSchema);
    expect(tool!.annotations?.readOnly).toBe(true);
  });

  test('list-videos returns real videos that match /videos', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { tag: 'playwright', limit: 3 });
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBeGreaterThan(0);
    expect(result.videos.length).toBeLessThanOrEqual(3);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(1500);

    for (const video of result.videos) {
      expect(video).toEqual(expect.objectContaining({
        title: expect.any(String),
        date: expect.any(String),
        link: expect.stringMatching(/^https:\/\/www\.youtube\.com\/watch\?v=/),
        tags: expect.any(Array)
      }));
      expect(video).toHaveProperty('conference');
      expect(video).toHaveProperty('host');
      expect(video.tags.map((t: string) => t.toLowerCase())).toContain('playwright');
    }

    await page.goto('/videos', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
    const pageText = await page.locator('main').textContent();
    for (const video of result.videos)
      expect(pageText).toContain(video.title);
  });

  test('bad input returns an error sentence, not an exception', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { tag: 'definitely-not-a-tag' });
    expect(result.error).toMatch(/No videos matched tag 'definitely-not-a-tag'/);
    expect(result.videos).toBeUndefined();
  });

  test('wrongly typed input is ignored instead of breaking the tool', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { tag: 42, host: { x: 1 }, limit: '2' } as any);
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBe(2);
  });

  test('output stays under about 1,500 characters', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { limit: 10 });
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBeGreaterThan(0);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(1500);
  });

  test('links keep a video\'s start offset', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { conference: 'Vue Amsterdam Meetup', limit: 10 });
    expect(result.error).toBeUndefined();
    const talk = result.videos.find((v: any) => v.title.startsWith('Static generated sites'));
    expect(talk?.link).toBe('https://www.youtube.com/watch?v=wTN6BPvs_6g&t=4530s');
  });

  test('list-videos shows a status pill, applies the tag filter, and highlights matching cards', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { tag: 'playwright', limit: 3 });
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBeGreaterThan(0);

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Agent used list-videos');
    await expect(status).toContainText('playwright');

    await expect(page).toHaveURL(/\/videos\/tags\/playwright\/?$/);

    const highlighted = page.locator('article.webmcp-agent-match[data-video-id]');
    await expect(highlighted).toHaveCount(result.videos.length);

    const highlightedIds = await highlighted.evaluateAll(els =>
      els.map(el => el.getAttribute('data-video-id'))
    );
    const resultIds = result.videos.map((v: { link: string }) => {
      const m = v.link.match(/[?&]v=([^&]+)/);
      return m?.[1];
    });
    expect(highlightedIds.sort()).toEqual([...resultIds].sort());

    await expect(highlighted.first()).toBeInViewport();
  });

  test('list-videos with a bad tag shows an error pill and keeps the tool error', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { tag: 'definitely-not-a-tag' });
    expect(result.error).toMatch(/No videos matched tag 'definitely-not-a-tag'/);

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toContainText('Agent used list-videos');
    await expect(status).toContainText('definitely-not-a-tag');
    await expect(page).not.toHaveURL(/\/videos\/tags\/definitely-not-a-tag/);
  });

  test('list-videos with no tag shows the pill without changing the filter', async ({ page }) => {
    await page.goto('/videos', { waitUntil: 'domcontentloaded' });
    await waitForWebmcpTools(page);

    const result: any = await page.webmcp.callTool('list-videos', { limit: 2 });
    expect(result.error).toBeUndefined();

    const status = page.getByRole('status');
    await expect(status).toBeVisible();
    await expect(status).toHaveText('Agent used list-videos');
    await expect(page).toHaveURL(/\/videos\/?$/);
    await expect(page.locator('article.webmcp-agent-match')).toHaveCount(0);
  });
});

test.describe('list-videos response size', () => {
  const long = (n: number) => 'x'.repeat(n);
  const bigVideo = (i: number) => ({
    title: long(5000),
    date: '2026-01-01',
    video: `id${i}`,
    tags: Array.from({ length: 50 }, () => long(500)),
    conference: long(2000),
    host: long(2000)
  });

  test('the whole response stays within the cap even with very long data', () => {
    for (const count of [1, 2, 10]) {
      const result: any = buildVideosResponse(Array.from({ length: count }, (_, i) => bigVideo(i)), 10);
      expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
      expect(result.videos.length).toBeGreaterThanOrEqual(1);
    }
  });

  test('a response just under the cap counts the videos wrapper too', () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({ title: long(110), date: '2026-01-01', video: `id${i}`, tags: ['playwright'] }));
    const result: any = buildVideosResponse(rows, 10);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    expect(result.videos.length).toBeLessThan(10);
  });
});

test('page load without WebMCP fetches no WebMCP code or content dump', async ({ browser, baseURL }) => {
  // Chromium 156+ may expose modelContext without --enable-features=WebMCP.
  // Hide it before any page scripts run so the plugin's feature-detect fails
  // the same way it would in a browser without WebMCP.
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      get: () => undefined
    });
    Object.defineProperty(navigator, 'modelContext', {
      configurable: true,
      get: () => undefined
    });
  });

  const urls: string[] = [];
  page.on('request', (req) => {
    urls.push(req.url());
  });

  await page.goto(baseURL || 'http://127.0.0.1:8000/', { waitUntil: 'networkidle' });

  const hasModelContext = await page.evaluate(() => {
    const mc = (document as any).modelContext ?? (navigator as any).modelContext;
    return Boolean(mc && typeof mc.registerTool === 'function');
  });
  expect(hasModelContext).toBe(false);

  // The tiny client plugin still loads (it performs the feature-detect).
  // Extra cost would be the lazy register/tools modules or the content dump.
  const suspicious = urls.filter(u =>
    /utils\/webmcp\/(?:register|tools)/i.test(u)
    || /sql_dump/i.test(u)
    || /__nuxt_content/i.test(u)
  );
  expect(suspicious).toEqual([]);

  await context.close();
});
