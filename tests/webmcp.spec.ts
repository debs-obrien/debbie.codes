import type { APIRequestContext } from '@playwright/test';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { parseDescriptionChapters } from '../utils/description-chapters';
import {
  DEFAULT_WEBMCP_OT_CHROME,
  DEFAULT_WEBMCP_OT_EDGE,
  originTrialMeta,
  shouldRenderOriginTrial
} from '../utils/origin-trial';
import { parseContentIndex } from '../utils/webmcp/content-index';
import { chapterMatch, currentPage, getVideo, resolveMatchedIn, listVideos as runListVideos, searchContent, topicBrief } from '../utils/webmcp/query';
import { buildVideosResponse } from '../utils/webmcp/response';
import { MAX_OUTPUT_CHARS, webmcpTools } from '../utils/webmcp/tools';
import { youtubeWatchUrl } from '../utils/youtube';
import { expect, test } from './fixtures';

const expected = Object.values(webmcpTools).map(t => t.name).sort();
const listVideos = webmcpTools.listVideos;
// Playwright loads this file outside native ESM, so avoid import.meta.
// cwd is the repo root for local, GHA, preview, and Endform runners.
const catalogPath = join(process.cwd(), 'public/webmcp/content-index.json');

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

test.describe('WebMCP tools', () => {
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
    expect(result.returned).toBe(result.videos.length);
    expect(typeof result.hasMore).toBe('boolean');
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);

    for (const video of result.videos) {
      expect(video).toEqual(expect.objectContaining({
        id: expect.any(String),
        title: expect.any(String),
        date: expect.any(String),
        link: expect.stringMatching(/^https:\/\/www\.youtube\.com\/watch\?v=/),
        tags: expect.any(Array),
        chaptersAvailable: expect.any(Boolean)
      }));
      expect(video).toHaveProperty('conference');
      expect(video).toHaveProperty('host');
      expect(video.tags.map((t: string) => t.toLowerCase())).toContain('playwright');
      expect(video).not.toHaveProperty('transcriptAvailable');
    }

    await page.goto('/videos', { waitUntil: 'domcontentloaded' });
    await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
    const pageText = await page.locator('main').textContent();
    for (const video of result.videos)
      expect(pageText).toContain(video.title);
  });

  test('list-videos includes total for conference-talk beyond the limit', async ({ page, request, baseURL }) => {
    const raw = await loadSiteCatalog(request, baseURL);
    const conferenceTalkCount = raw.items.filter((item: { type?: string, tags?: string[] }) =>
      item.type === 'video' && item.tags?.includes('conference-talk')
    ).length;
    const result: any = await page.webmcp.callTool('list-videos', { tag: 'conference-talk', limit: 5 });
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBe(5);
    expect(result.returned).toBe(5);
    expect(result.total).toBeGreaterThan(5);
    expect(result.total).toBe(conferenceTalkCount);
    expect(result.hasMore).toBe(true);
    expect(result.nextOffset).toBe(5);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
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

  test('output stays under the WebMCP size cap', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { limit: 10 });
    expect(result.error).toBeUndefined();
    expect(result.videos.length).toBeGreaterThan(0);
    expect(result.returned).toBe(result.videos.length);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    if (result.trimmed) {
      expect(result.note).toMatch(/trimmed|nextOffset/i);
      expect(result.hasMore).toBe(true);
      expect(result.nextOffset).toBe(result.returned);
    }
  });

  test('links keep a video\'s start offset', async ({ page }) => {
    const result: any = await page.webmcp.callTool('list-videos', { conference: 'Vue Amsterdam Meetup', limit: 10 });
    expect(result.error).toBeUndefined();
    const talk = result.videos.find((v: any) => v.title.startsWith('Static generated sites'));
    expect(talk?.link).toBe('https://www.youtube.com/watch?v=wTN6BPvs_6g&t=4530s');
  });

  test('registers every tool as read-only', async ({ page }) => {
    const tools = await page.webmcp.tools();
    expect(tools.map(tool => tool.name).sort()).toEqual(Object.values(webmcpTools).map(tool => tool.name).sort());
    for (const tool of tools)
      expect(tool.annotations?.readOnly).toBe(true);
  });

  test('topic-brief summarizes mcp and accepts the long alias', async ({ page, request, baseURL }) => {
    // Prefer the site under test so Netlify preview / merge-commit checkouts
    // do not compare a regenerated local index against a different deploy.
    const raw = await loadSiteCatalog(request, baseURL);
    const tagged = raw.items.filter((item: { tags?: string[] }) => item.tags?.includes('mcp'));
    const counts = { blog: 0, video: 0, podcast: 0, course: 0 };
    for (const item of tagged) {
      if (item.type === 'blog' || item.type === 'video' || item.type === 'podcast' || item.type === 'course')
        counts[item.type as keyof typeof counts] += 1;
    }
    const sectionPath = { video: 'videos', blog: 'blog', podcast: 'podcasts', course: 'courses' } as const;
    let best: keyof typeof sectionPath = 'video';
    let bestCount = -1;
    for (const kind of ['video', 'blog', 'podcast', 'course'] as const) {
      if (counts[kind] > bestCount) {
        best = kind;
        bestCount = counts[kind];
      }
    }
    const direct: any = await page.webmcp.callTool('topic-brief', { topic: 'mcp' });
    const alias: any = await page.webmcp.callTool('topic-brief', { topic: 'model context protocol' });
    expect(direct.error).toBeUndefined();
    expect(direct.topic).toBe('mcp');
    expect(direct.total).toBe(tagged.length);
    expect(direct.counts).toEqual(counts);
    expect(direct.listing).toBe(`https://debbie.codes/${sectionPath[best]}/tags/mcp`);
    expect(direct.highlights.length).toBeGreaterThan(0);
    expect(direct.highlights.length).toBeLessThanOrEqual(8);
    expect(direct.returned).toBe(direct.highlights.length);
    expect(JSON.stringify(direct).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    for (const highlight of direct.highlights) {
      expect(highlight).toEqual(expect.objectContaining({
        type: expect.stringMatching(/^(blog|video|podcast|course)$/),
        title: expect.any(String),
        date: expect.any(String),
        url: expect.any(String)
      }));
      expect(highlight).not.toHaveProperty('description');
      if (highlight.chapters) {
        expect(highlight.chapters.length).toBeLessThanOrEqual(2);
        for (const chapter of highlight.chapters) {
          expect(chapter.title).toEqual(expect.any(String));
          expect(chapter.url).toMatch(/^https:\/\/www\.youtube\.com\/watch\?v=/);
        }
      }
    }
    expect(alias.topic).toBe('mcp');
    expect(alias.total).toBe(direct.total);
    saveSample('topic-brief-mcp', direct);
  });

  test('topic-brief reports an unknown topic with real tags', async ({ page }) => {
    const result: any = await page.webmcp.callTool('topic-brief', { topic: 'definitely-not-a-topic' });
    expect(result.error).toMatch(/No content matched topic 'definitely-not-a-topic'/);
    expect(result.error).toMatch(/playwright|mcp|ai|nuxt/);
    expect(result.highlights).toBeUndefined();
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  });

  test('topic-brief mcp first and second call', async ({ page }) => {
    const call = async () => {
      const started = Date.now();
      const result: any = await page.webmcp.callTool('topic-brief', { topic: 'mcp' });
      return { ms: Date.now() - started, result };
    };
    const first = await call();
    const second = await call();
    const warm = [];
    for (let i = 0; i < 4; i++)
      warm.push(await call());
    expect(first.result.error).toBeUndefined();
    expect(first.result.topic).toBe('mcp');
    expect(first.result.total).toBeGreaterThan(0);
    expect(second.result.total).toBe(first.result.total);
    const times = [second.ms, ...warm.map(sample => sample.ms)];
    saveSample('topic-brief-timings', { first: first.ms, second: second.ms, warm: times });
  });

  test('search-content finds playwright agents and a chapter deep link', async ({ page, request, baseURL }) => {
    const found: any = await page.webmcp.callTool('search-content', { query: 'playwright agents' });
    expect(found.error).toBeUndefined();
    expect(found.results.length).toBeGreaterThan(0);
    expect(found.results.length).toBeLessThanOrEqual(6);
    expect(found.total).toBeGreaterThanOrEqual(found.results.length);
    expect(found.returned).toBe(found.results.length);
    expect(JSON.stringify(found).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    expect(found.results.some((result: { title: string }) => /playwright/i.test(result.title) && /agent/i.test(result.title))).toBe(true);
    for (const result of found.results) {
      expect(result).toEqual(expect.objectContaining({
        type: expect.stringMatching(/^(blog|video|podcast|course)$/),
        title: expect.any(String),
        date: expect.any(String),
        url: expect.any(String),
        matchedIn: expect.stringMatching(/^(title|chapter|tags|description)$/)
      }));
      expect(result).not.toHaveProperty('description');
      expect(result).not.toHaveProperty('transcriptAvailable');
      if (result.type === 'video') {
        expect(result.id).toEqual(expect.any(String));
        expect(typeof result.chaptersAvailable).toBe('boolean');
      }
    }
    saveSample('search-content-playwright-agents', found);

    const index = parseContentIndex(await loadSiteCatalog(request, baseURL));
    const video = index.items.find(item =>
      item.type === 'video'
      && item.chapters?.some(chapter => chapter.time > 0 && chapter.title.length >= 12 && chapter.title.length <= 80)
    );
    expect(video?.type).toBe('video');
    if (video?.type !== 'video' || !video.chapters)
      return;
    const chapter = video.chapters.find(entry => entry.time > 0 && entry.title.length <= 80 && entry.title.split(/\s+/).length >= 3);
    expect(chapter).toBeTruthy();
    if (!chapter)
      return;
    const deep: any = await page.webmcp.callTool('search-content', { query: chapter.title });
    expect(deep.error).toBeUndefined();
    const hit = deep.results.find((result: { url: string }) => result.url.includes(`t=${chapter.time}s`));
    expect(hit?.url).toBe(youtubeWatchUrl(video.video, chapter.time));
    expect(hit?.chapter).toBe(chapter.title);
    expect(hit?.startSeconds).toBe(chapter.time);
    expect(hit?.matchedIn).toMatch(/^(title|chapter)$/);
    expect(JSON.stringify(deep).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  });

  test('search-content returns an error when nothing matches', async ({ page }) => {
    const result: any = await page.webmcp.callTool('search-content', { query: 'zzzz-not-real-content' });
    expect(result.error).toMatch(/zzzz-not-real-content/);
    expect(result.error).toMatch(/playwright|mcp|ai|nuxt/);
    expect(result.results).toBeUndefined();
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  });

  test('search-content can limit results to courses', async ({ page }) => {
    const result: any = await page.webmcp.callTool('search-content', { query: 'mcp', type: 'course' });
    expect(result.error).toBeUndefined();
    expect(result.results.length).toBeGreaterThan(0);
    expect(result.results.every((item: { type: string }) => item.type === 'course')).toBe(true);
    expect(result.total).toBeGreaterThanOrEqual(result.results.length);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  });

  test('get-video returns chapters for a listed id', async ({ page }) => {
    const listed: any = await page.webmcp.callTool('list-videos', { tag: 'playwright', limit: 5 });
    const withChapters = listed.videos.find((video: { chaptersAvailable: boolean }) => video.chaptersAvailable);
    expect(withChapters?.id).toEqual(expect.any(String));
    const result: any = await page.webmcp.callTool('get-video', { id: withChapters.id });
    expect(result.error).toBeUndefined();
    expect(result.id).toBe(withChapters.id);
    expect(result.chaptersAvailable).toBe(true);
    expect(result.chapters.length).toBeGreaterThan(0);
    expect(result).not.toHaveProperty('transcriptAvailable');
    for (const chapter of result.chapters) {
      expect(chapter).toEqual(expect.objectContaining({
        startSeconds: expect.any(Number),
        title: expect.any(String),
        url: expect.stringMatching(/^https:\/\/www\.youtube\.com\/watch\?v=/)
      }));
    }
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    saveSample('get-video-playwright', result);
  });

  test('get-video errors for unknown and banned ids', async ({ page }) => {
    const missing: any = await page.webmcp.callTool('get-video', { id: 'not-a-real-video-id' });
    expect(missing.error).toMatch(/No video found for id 'not-a-real-video-id'/);
    const banned: any = await page.webmcp.callTool('get-video', { id: 'A8Gu-ayw6dM' });
    expect(banned.error).toMatch(/No video found for id 'A8Gu-ayw6dM'/);
    expect(banned.chapters).toBeUndefined();
  });

  test('get-current-page on a blog post returns that post and related items', async ({ page }) => {
    await page.goto('/blog/github-mcp-server', { waitUntil: 'domcontentloaded' });
    await waitForWebmcpTools(page);
    const result: any = await page.webmcp.callTool('get-current-page', {});
    expect(result.error).toBeUndefined();
    expect(result.page).toBe('Blog post');
    expect(result.type).toBe('blog');
    expect(result.title).toContain('GitHub MCP');
    expect(result.url).toBe('https://debbie.codes/blog/github-mcp-server');
    expect(result.tags.map((tag: string) => tag.toLowerCase())).toContain('mcp');
    expect(result).not.toHaveProperty('description');
    expect(result.related.length).toBeGreaterThan(0);
    expect(result.related.length).toBeLessThanOrEqual(4);
    for (const related of result.related) {
      expect(related).toEqual(expect.objectContaining({
        type: expect.any(String),
        title: expect.any(String),
        date: expect.any(String),
        url: expect.any(String)
      }));
      expect(related).not.toHaveProperty('description');
    }
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    saveSample('get-current-page-blog', result);
  });

  test('get-current-page on the home page points at the other tools', async ({ page }) => {
    const result: any = await page.webmcp.callTool('get-current-page', {});
    expect(result.error).toBeUndefined();
    expect(result.page).toBe('Home');
    expect(result.hint).toMatch(/list-videos/);
    expect(result.hint).toMatch(/get-video/);
    expect(result.hint).toMatch(/topic-brief/);
    expect(result.hint).toMatch(/search-content/);
    expect(result.title).toBeUndefined();
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  });

  test('tool calls do not query the content database', async ({ page }) => {
    const urls: string[] = [];
    page.on('request', req => urls.push(req.url()));
    const result: any = await page.webmcp.callTool('topic-brief', { topic: 'mcp' });
    expect(result.error).toBeUndefined();
    expect(urls.filter(url => /sql_dump|__nuxt_content/.test(url))).toEqual([]);
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

  test('a response just under the cap counts the videos wrapper too and reports trimming', () => {
    const rows = Array.from({ length: 10 }, (_, i) => ({ title: long(110), date: '2026-01-01', video: `id${i}`, tags: ['playwright'], chaptersAvailable: true }));
    const result: any = buildVideosResponse(rows, 10);
    expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
    expect(result.videos.length).toBeLessThan(10);
    expect(result.total).toBe(10);
    expect(result.returned).toBe(result.videos.length);
    expect(result.trimmed).toBe(true);
    expect(result.hasMore).toBe(true);
    expect(result.nextOffset).toBe(result.returned);
    expect(result.note).toMatch(/trimmed|nextOffset/i);
  });
});

function loadCatalogFromDisk() {
  if (!existsSync(catalogPath))
    throw new Error(`missing content index at ${catalogPath}`);
  return JSON.parse(readFileSync(catalogPath, 'utf8'));
}

/** Catalog the site under test actually serves (preview-safe). Falls back to disk. */
async function loadSiteCatalog(request: APIRequestContext, baseURL?: string) {
  const root = (baseURL || process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL || '').replace(/\/$/, '');
  if (root) {
    const response = await request.get(`${root}/webmcp/content-index.json`);
    expect(response.ok(), `GET ${root}/webmcp/content-index.json → ${response.status()}`).toBeTruthy();
    return await response.json();
  }
  return loadCatalogFromDisk();
}

function saveSample(name: string, value: unknown) {
  const path = test.info().outputPath(`${name}.json`);
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  test.info().attachments.push({
    name: `${name}.json`,
    path,
    contentType: 'application/json'
  });
}

function isWebmcpPayload(url: string) {
  return /\/utils\/webmcp\/(?:register|tools|query|content-index)/.test(url)
    || url.includes('/webmcp/content-index.json')
    || /sql_dump/.test(url)
    || url.includes('__nuxt_content');
}

test('page load without document.modelContext fetches no WebMCP code or index', async ({ context, baseURL }) => {
  // Chromium 156+ may expose modelContext without --enable-features=WebMCP.
  // Hide document.modelContext and leave a navigator stub so the plugin has to
  // ignore navigator.modelContext the same way a browser without the feature would.
  // Use the fixture `context` (not browser.newContext) so Cloudinary stays blocked.
  const page = await context.newPage();
  await page.addInitScript(() => {
    Object.defineProperty(document, 'modelContext', {
      configurable: true,
      get: () => undefined
    });
    Object.defineProperty(navigator, 'modelContext', {
      configurable: true,
      get: () => ({ registerTool: () => Promise.resolve() })
    });
  });

  const urls: string[] = [];
  page.on('request', (req) => {
    urls.push(req.url());
  });

  await page.goto(baseURL || 'http://127.0.0.1:8000/', { waitUntil: 'networkidle' });

  const hasDocumentModelContext = await page.evaluate(() => {
    const mc = (document as { modelContext?: { registerTool?: unknown } }).modelContext;
    return Boolean(mc && typeof mc.registerTool === 'function');
  });
  expect(hasDocumentModelContext).toBe(false);

  // The tiny client plugin still loads (it performs the feature-detect).
  // register, tools, the content index, and the content dump must not.
  expect(urls.filter(isWebmcpPayload)).toEqual([]);

  await page.close();
});

test('tool catalog stays inside the WebMCP size limits', () => {
  expect(Object.values(webmcpTools).map(tool => tool.name).sort()).toEqual([
    'get-current-page',
    'get-video',
    'list-videos',
    'search-content',
    'topic-brief'
  ]);
  for (const tool of Object.values(webmcpTools)) {
    expect(tool.name.length).toBeLessThanOrEqual(30);
    expect(tool.description.length).toBeLessThanOrEqual(500);
    expect(tool.annotations.readOnlyHint).toBe(true);
    for (const prop of Object.values(tool.inputSchema.properties)) {
      if ('description' in prop && typeof prop.description === 'string')
        expect(prop.description.length).toBeLessThanOrEqual(150);
    }
  }
  expect(webmcpTools.listVideos.inputSchema.properties).toHaveProperty('offset');
  expect(webmcpTools.searchContent.inputSchema.properties).toHaveProperty('offset');
  expect(webmcpTools.getVideo.inputSchema.required).toEqual(['id']);
});

test('content index omits banned videos and keeps chapter timestamps', async ({ request, baseURL }) => {
  // Endform runners may not ship public/; prefer the preview URL when set.
  const raw = await loadSiteCatalog(request, baseURL);
  const index = parseContentIndex(raw);
  const ids = index.items.flatMap(item => item.type === 'video' ? [item.video] : []);
  expect(ids).not.toContain('A8Gu-ayw6dM');
  expect(ids).not.toContain('yi8b55MLLlg');
  const talk = index.items.find(item => item.type === 'video' && item.video === 'wTN6BPvs_6g');
  expect(talk?.type === 'video' ? talk.url : '').toBe(youtubeWatchUrl('wTN6BPvs_6g', 4530));
  expect(index.items.some(item => item.type === 'video' && item.chapters && item.chapters.length >= 2)).toBe(true);
});

test('description timestamps become chapters and prose does not', () => {
  expect(parseDescriptionChapters('Thanks for watching.\n0:00 Only one line')).toEqual([]);
  expect(parseDescriptionChapters('No timestamps in this description.')).toEqual([]);
  expect(parseDescriptionChapters([
    'Overview',
    '0:00 Introduction to MCP servers',
    '3:00 Project setup and dependencies',
    '1:02:03 Deep dive'
  ].join('\n'))).toEqual([
    { time: 0, title: 'Introduction to MCP servers' },
    { time: 180, title: 'Project setup and dependencies' },
    { time: 3723, title: 'Deep dive' }
  ]);
});

test('topic-brief clips oversized titles and resolves the mcp alias', () => {
  const items = Array.from({ length: 12 }, (_, index) => ({
    type: 'video' as const,
    title: 'x'.repeat(4000),
    date: `2026-01-${String(index + 1).padStart(2, '0')}`,
    tags: ['mcp'],
    url: `https://www.youtube.com/watch?v=video${index}xxxx`,
    description: 'y'.repeat(4000),
    video: `video${index}xxxx`,
    chapters: Array.from({ length: 6 }, (__, chapter) => ({ time: chapter * 30 + 1, title: 'z'.repeat(400) }))
  }));
  const result: any = topicBrief({ items }, 'model context protocol');
  expect(result.error).toBeUndefined();
  expect(result.topic).toBe('mcp');
  expect(result.total).toBe(12);
  expect(result.returned).toBe(result.highlights.length);
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  if (result.returned < result.total)
    expect(result.trimmed).toBe(true);
  const missing: any = topicBrief({ items }, 'definitely-not-a-topic');
  expect(missing.error).toMatch(/definitely-not-a-topic/);
  expect(missing.error).toMatch(/mcp/);
});

test('search-content and get-current-page stay within the size cap', () => {
  const items = Array.from({ length: 10 }, (_, index) => ({
    type: 'blog' as const,
    title: 'playwright agents '.repeat(80),
    date: `2026-02-${String(index + 1).padStart(2, '0')}`,
    tags: ['playwright', 'mcp'],
    url: `https://debbie.codes/blog/post-${index}`,
    path: index === 0 ? '/blog/post-0' : undefined,
    description: 'playwright agents '.repeat(80)
  }));
  const found: any = searchContent({ items }, { query: 'playwright agents' });
  expect(found.error).toBeUndefined();
  expect(found.results.length).toBeGreaterThan(0);
  expect(found.results.length).toBeLessThanOrEqual(6);
  expect(found.total).toBe(10);
  expect(found.returned).toBe(found.results.length);
  expect(JSON.stringify(found).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  const page: any = currentPage({ items }, '/blog/post-0');
  expect(page.error).toBeUndefined();
  expect(page.type).toBe('blog');
  expect(JSON.stringify(page).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  expect((searchContent({ items }, { query: 'zzzz-not-real-content' }) as any).error).toMatch(/zzzz-not-real-content/);
});

test('list-videos and search-content paginate a 27-match set with no gaps or duplicates', () => {
  const items = Array.from({ length: 27 }, (_, index) => ({
    type: 'video' as const,
    title: `Playwright tip ${String(index + 1).padStart(2, '0')}`,
    date: `2026-03-${String((index % 28) + 1).padStart(2, '0')}`,
    tags: ['playwright'],
    url: `https://www.youtube.com/watch?v=page${String(index).padStart(4, '0')}`,
    description: 'Playwright tips for agents',
    video: `page${String(index).padStart(4, '0')}`,
    chapters: [{ time: 10, title: 'Introducing Playwright MCP for agents' }]
  }));
  const index = { items };
  const seen = new Set<string>();
  let offset = 0;
  let pages = 0;
  while (true) {
    const page: any = runListVideos(index, { tag: 'playwright', limit: 5, offset });
    expect(page.error).toBeUndefined();
    expect(page.total).toBe(27);
    expect(page.returned).toBe(page.videos.length);
    expect(page.returned).toBeGreaterThan(0);
    for (const video of page.videos) {
      expect(seen.has(video.id)).toBe(false);
      seen.add(video.id);
      expect(video.chaptersAvailable).toBe(true);
    }
    pages += 1;
    if (!page.hasMore) {
      expect(page.nextOffset).toBeNull();
      break;
    }
    expect(page.nextOffset).toBe(offset + page.returned);
    offset = page.nextOffset;
    expect(pages).toBeLessThan(20);
  }
  expect(seen.size).toBe(27);

  const searchSeen = new Set<string>();
  offset = 0;
  pages = 0;
  while (true) {
    const page: any = searchContent(index, { query: 'playwright tip', offset });
    expect(page.error).toBeUndefined();
    expect(page.total).toBe(27);
    expect(page.returned).toBe(page.results.length);
    for (const result of page.results) {
      expect(searchSeen.has(result.id)).toBe(false);
      searchSeen.add(result.id);
      expect(result.matchedIn).toBeTruthy();
    }
    pages += 1;
    if (!page.hasMore) {
      expect(page.nextOffset).toBeNull();
      break;
    }
    expect(page.nextOffset).toBe(offset + page.returned);
    offset = page.nextOffset;
    expect(pages).toBeLessThan(20);
  }
  expect(searchSeen.size).toBe(27);
});

test('chapterMatch requires every query word and prefers full-phrase chapters', () => {
  const item = {
    type: 'video' as const,
    title: 'Playwright Live',
    date: '2026-01-01',
    tags: ['playwright', 'mcp'],
    url: 'https://www.youtube.com/watch?v=chapterdemo01',
    description: 'A Playwright stream',
    video: 'chapterdemo01',
    chapters: [
      { time: 0, title: 'What is Playwright?' },
      { time: 120, title: 'Introducing Playwright MCP' },
      { time: 240, title: 'Playwright MCP deep dive' }
    ]
  };
  const words = ['playwright', 'mcp'];
  expect(chapterMatch(item, words, 'Playwright MCP')?.title).toMatch(/Playwright MCP/);
  expect(chapterMatch(item, words, 'Playwright MCP')?.title).not.toBe('What is Playwright?');
  const partial: any = searchContent({ items: [item] }, { query: 'Playwright MCP' });
  expect(partial.error).toBeUndefined();
  expect(partial.results[0].chapter).not.toBe('What is Playwright?');
  expect(partial.results[0].chapter).toMatch(/Playwright MCP/);
  expect(partial.results[0].startSeconds).toBeGreaterThanOrEqual(0);
  expect(partial.results[0].url).toContain('t=');
  expect(partial.results[0].matchedIn).toMatch(/^(title|chapter|tags)$/);

  const onlyPlaywrightChapter = {
    ...item,
    title: 'Some other talk',
    tags: ['testing'],
    description: 'mentions playwright mcp in the description only',
    chapters: [{ time: 15, title: 'What is Playwright?' }]
  };
  const noFalseChapter: any = searchContent({ items: [onlyPlaywrightChapter] }, { query: 'Playwright MCP' });
  expect(noFalseChapter.error).toBeUndefined();
  expect(noFalseChapter.results[0].chapter).toBeUndefined();
  expect(noFalseChapter.results[0].matchedIn).toBe('description');

  const mixed = {
    type: 'video' as const,
    title: 'Playwright Live',
    date: '2026-01-02',
    tags: ['mcp'],
    url: 'https://www.youtube.com/watch?v=mixedmatch0001',
    description: '',
    video: 'mixedmatch0001',
    chapters: [] as { time: number, title: string }[]
  };
  expect(resolveMatchedIn(mixed, ['playwright', 'mcp'], 'Playwright MCP')).toBe('title');
  const mixedSearch: any = searchContent({ items: [mixed] }, { query: 'Playwright MCP' });
  expect(mixedSearch.error).toBeUndefined();
  expect(mixedSearch.results[0].matchedIn).toBe('title');
  expect(mixedSearch.results[0].matchedIn).not.toBe('description');
});

test('get-video returns chapters and rejects unknown or banned ids', () => {
  const index = parseContentIndex(loadCatalogFromDisk());
  const candidates = index.items.filter(item =>
    item.type === 'video' && (item.chapters?.length ?? 0) >= 3 && (item.chapters?.length ?? 0) <= 12
  );
  let known = candidates[0];
  for (const item of candidates) {
    if (item.type !== 'video')
      continue;
    const probe: any = getVideo(index, item.video);
    if (!probe.trimmed && probe.chapters?.length === item.chapters!.length) {
      known = item;
      break;
    }
  }
  expect(known?.type).toBe('video');
  if (known?.type !== 'video')
    return;
  const result: any = getVideo(index, known.video);
  expect(result.error).toBeUndefined();
  expect(result.id).toBe(known.video);
  expect(result.chaptersAvailable).toBe(true);
  expect(result.trimmed).toBeUndefined();
  expect(result.chapters.length).toBe(known.chapters!.length);
  expect(result.chapters[0]).toEqual(expect.objectContaining({
    startSeconds: expect.any(Number),
    title: expect.any(String),
    url: expect.stringMatching(/^https:\/\/www\.youtube\.com\/watch\?v=/)
  }));
  expect(result).not.toHaveProperty('transcriptAvailable');
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);

  expect((getVideo(index, 'missing-id-zzzz') as any).error).toMatch(/No video found for id 'missing-id-zzzz'/);
  expect((getVideo(index, 'A8Gu-ayw6dM') as any).error).toMatch(/No video found for id 'A8Gu-ayw6dM'/);
  expect((getVideo(index, 'yi8b55MLLlg') as any).error).toMatch(/No video found for id 'yi8b55MLLlg'/);
});

test('get-video reports when chapters are trimmed to the size cap', () => {
  const chapters = Array.from({ length: 80 }, (_, index) => ({
    time: index * 30,
    title: `Chapter ${index + 1}: ${'detail '.repeat(20)}`
  }));
  const item = {
    type: 'video' as const,
    title: 'Huge chapter list',
    date: '2026-04-01',
    tags: ['playwright'],
    url: 'https://www.youtube.com/watch?v=hugechapters01',
    description: 'A long description '.repeat(40),
    video: 'hugechapters01',
    chapters
  };
  const result: any = getVideo({ items: [item] }, 'hugechapters01');
  expect(result.error).toBeUndefined();
  expect(result.trimmed).toBe(true);
  expect(result.chapters.length).toBeLessThan(80);
  expect(result.note).toMatch(/Returned \d+ of 80 chapters/);
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
});

test('get-video fallback bounds tags and stays under the size cap', () => {
  const item = {
    type: 'video' as const,
    title: 'x'.repeat(400),
    date: '2026-04-02',
    tags: Array.from({ length: 6 }, () => 't'.repeat(500)),
    url: 'https://www.youtube.com/watch?v=hugetags000001',
    description: 'y'.repeat(800),
    video: 'hugetags000001',
    chapters: Array.from({ length: 40 }, (_, index) => ({
      time: index * 10,
      title: `Chapter ${index + 1} ${'z'.repeat(120)}`
    }))
  };
  const result: any = getVideo({ items: [item] }, 'hugetags000001');
  expect(JSON.stringify(result).length).toBeLessThanOrEqual(MAX_OUTPUT_CHARS);
  if (result.error) {
    expect(result.error).toMatch(/too long to return/);
    return;
  }
  expect(result.tags.length).toBeLessThanOrEqual(6);
  for (const tag of result.tags)
    expect(tag.length).toBeLessThanOrEqual(40);
  expect(result.chapters.length).toBeLessThanOrEqual(40);
});

test('origin-trial meta is present only for non-empty tokens', () => {
  expect(originTrialMeta('', '')).toEqual([]);
  expect(originTrialMeta('   ', undefined)).toEqual([]);
  expect(originTrialMeta('chrome-token', '')).toEqual([
    { 'http-equiv': 'origin-trial', 'content': 'chrome-token', 'key': 'origin-trial:chrome-token' }
  ]);
  expect(originTrialMeta('chrome-token', 'edge-token')).toEqual([
    { 'http-equiv': 'origin-trial', 'content': 'chrome-token', 'key': 'origin-trial:chrome-token' },
    { 'http-equiv': 'origin-trial', 'content': 'edge-token', 'key': 'origin-trial:edge-token' }
  ]);
  expect(originTrialMeta(DEFAULT_WEBMCP_OT_CHROME, DEFAULT_WEBMCP_OT_EDGE)).toHaveLength(2);
});

test('origin-trial meta renders only for production (or explicit override)', () => {
  expect(shouldRenderOriginTrial({ CONTEXT: 'production' })).toBe(true);
  expect(shouldRenderOriginTrial({ CONTEXT: 'deploy-preview' })).toBe(false);
  expect(shouldRenderOriginTrial({ CONTEXT: 'branch-deploy' })).toBe(false);
  expect(shouldRenderOriginTrial({})).toBe(false);
  expect(shouldRenderOriginTrial({ NUXT_PUBLIC_WEBMCP_OT_RENDER: '1' })).toBe(true);
  expect(shouldRenderOriginTrial({ CONTEXT: 'production', NUXT_PUBLIC_WEBMCP_OT_RENDER: '0' })).toBe(false);
});

test('llms.txt lists the main sections and WebMCP tools', async ({ request }) => {
  const response = await request.get('/llms.txt');
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type'] ?? '').toContain('text/plain');
  const body = await response.text();
  expect(body).toContain('# Debbie Codes');
  expect(body).toContain('## Videos');
  expect(body).toContain('## Blog');
  expect(body).toContain('## Podcasts');
  expect(body).toContain('## Courses');
  expect(body).toContain('WebMCP');
  expect(body).toContain('list-videos');
  expect(body).toContain('topic-brief');
  expect(body).toContain('search-content');
  expect(body).toContain('get-video');
  expect(body).toContain('get-current-page');
  expect(body).toContain('https://debbie.codes/videos/tags/mcp');
});

test('the home page does not link llms.txt', async ({ page }) => {
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('a[href*="llms.txt"]')).toHaveCount(0);
});

test('origin-trial meta is absent on the local (non-production) home page', async ({ page }) => {
  // Defaults are in runtimeConfig, but webmcpOtRender is '0' unless
  // CONTEXT=production at build/dev start (Netlify production for debbie.codes).
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('meta[http-equiv="origin-trial"]')).toHaveCount(0);
});
