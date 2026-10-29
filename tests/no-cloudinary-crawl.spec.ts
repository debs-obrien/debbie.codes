import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, isCloudinaryBandwidthRequest, test } from './fixtures';

/**
 * Crawl sitemap routes and assert zero Cloudinary bandwidth requests,
 * no broken image/media responses, and width+height on migrated <img>s.
 *
 * Uses a **fixed** number of parallel shard tests (stable Playwright test IDs
 * for Endform). Each shard loads the sitemap at runtime — from disk when
 * present, otherwise from `${baseURL}/sitemap.xml` on the deploy preview.
 */

const SHARD_COUNT = 8;

/** Decode Netlify CDN query params (`url=%2Fimages%2F…`) before path checks. */
function decodeSrc(src: string): string {
  try {
    return decodeURIComponent(src);
  }
  catch {
    return src;
  }
}

function requestHostname(url: string): string | null {
  try {
    return new URL(url).hostname;
  }
  catch {
    return null;
  }
}

/** True when src is a local /images/... asset (content, blog, podcasts). */
function isLocalImageSrc(src: string): boolean {
  const decoded = decodeSrc(src);
  return (
    decoded.includes('/images/content/')
    || decoded.includes('/images/blog/')
    || decoded.includes('/images/podcasts/')
  );
}

function isSoftMediaStatus(status: number): boolean {
  return status === 403 || status === 429 || status >= 500;
}

function isHardMediaStatus(status: number): boolean {
  // Fail allowlist misses (400) and gone/missing; soft statuses warn only.
  return status === 400 || status === 404 || status === 410
    || (status >= 400 && !isSoftMediaStatus(status));
}

function parseSitemapXml(xml: string): string[] {
  const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
  return locs.map((loc) => {
    try {
      return new URL(loc).pathname;
    }
    catch {
      return loc.replace(/^https?:\/\/[^/]+/, '') || '/';
    }
  });
}

async function loadRoutes(baseURL: string | undefined): Promise<string[]> {
  const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
  if (existsSync(sitemapPath))
    return parseSitemapXml(readFileSync(sitemapPath, 'utf8'));

  const origin = (baseURL || 'http://127.0.0.1:8000').replace(/\/$/, '');
  const res = await fetch(`${origin}/sitemap.xml`);
  if (!res.ok)
    throw new Error(`Failed to fetch sitemap.xml: ${res.status}`);
  return parseSitemapXml(await res.text());
}

async function scrollAndAwaitImages(page: import('@playwright/test').Page) {
  // Self-deadline inside the page so evaluate always settles (no abandoned CDP calls).
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise(r => setTimeout(r, ms));
    const deadline = Date.now() + 10_000;
    const height = () => Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    // Step down so lazy-loaders fire. Cap iterations — growing pages must not hang.
    const step = Math.max(window.innerHeight, 400);
    let y = 0;
    for (let i = 0; i < 40 && Date.now() < deadline; i++) {
      const h = height();
      y = Math.min(y + step, h);
      window.scrollTo(0, y);
      await sleep(25);
      if (y >= h)
        break;
    }
    window.scrollTo(0, height());
    await sleep(25);

    const remaining = Math.max(0, deadline - Date.now());
    const perImg = Math.min(1_500, remaining);
    if (perImg <= 0)
      return;

    const pending = Array.from(document.images).filter(
      img => !(img.complete && img.naturalWidth > 0)
    );
    await Promise.all(pending.map(img => Promise.race([
      new Promise<void>((resolve) => {
        img.addEventListener('load', () => resolve(), { once: true });
        img.addEventListener('error', () => resolve(), { once: true });
        if (img.complete)
          resolve();
      }),
      (img.decode?.() ?? Promise.resolve()).then(() => undefined).catch(() => undefined),
      sleep(perImg)
    ])));
  });
}

test.describe('No Cloudinary crawl', () => {
  test.use({ blockCloudinary: false });

  for (let shard = 0; shard < SHARD_COUNT; shard++) {
    test(`sitemap shard ${shard + 1}/${SHARD_COUNT}`, async ({ page, baseURL }) => {
      const allRoutes = await loadRoutes(baseURL);
      expect(allRoutes.length).toBeGreaterThan(10);

      // Cap local runs; full set on CI / deploy preview / Endform
      const full = Boolean(
        process.env.CI
        || process.env.PLAYWRIGHT_TEST_BASE_URL
        || process.env.BASE_URL
        || process.env.ENDFORM === 'true'
      );
      const sample = full ? allRoutes : allRoutes.slice(0, Math.min(allRoutes.length, 40));
      const routes = sample.filter((_, i) => i % SHARD_COUNT === shard);
      if (routes.length === 0)
        return;

      // Scroll + decode can take longer than a brief settle (esp. under workers).
      test.setTimeout(Math.max(180_000, routes.length * 30_000));

      const origin = (baseURL || 'http://127.0.0.1:8000').replace(/\/$/, '');

      for (const path of routes) {
        const cloudinaryHits: string[] = [];
        const mediaEvents: Array<{ status: number, url: string }> = [];

        const onResponse = (res: import('@playwright/test').Response) => {
          const url = res.url();
          if (isCloudinaryBandwidthRequest(url))
            cloudinaryHits.push(url);
          const type = res.request().resourceType();
          if ((type === 'image' || type === 'media') && res.status() >= 400)
            mediaEvents.push({ status: res.status(), url });
        };
        page.on('response', onResponse);

        await page.goto(path.startsWith('http') ? path : `${origin}${path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000
        });
        await scrollAndAwaitImages(page);

        const coverOgUrls = await page.evaluate(() => {
          const urls = new Set<string>();
          for (const sel of [
            'meta[property="og:image"]',
            'meta[name="twitter:image"]'
          ]) {
            for (const el of document.querySelectorAll(sel)) {
              const c = el.getAttribute('content');
              if (c)
                urls.add(c);
            }
          }
          for (const img of document.querySelectorAll<HTMLImageElement>(
            'article header img, [data-testid="blog-card-cover"] img'
          )) {
            if (img.currentSrc)
              urls.add(img.currentSrc);
            if (img.src)
              urls.add(img.src);
          }
          return [...urls];
        });
        const coverOgSet = new Set(coverOgUrls);

        const isCoverOrOg = (url: string) => {
          if (coverOgSet.has(url))
            return true;
          for (const c of coverOgSet) {
            if (!c)
              continue;
            if (url.includes(c) || c.includes(url.split('?')[0]!))
              return true;
          }
          return false;
        };

        const badMedia: string[] = [];
        for (const { status, url } of mediaEvents) {
          const host = requestHostname(url);
          const isNetlifyCdn = url.includes('/.netlify/images');
          // Skip only direct images.unsplash.com requests that are not cover/og.
          // Never skip /.netlify/images — even when url= points at Unsplash.
          if (
            host === 'images.unsplash.com'
            && !isNetlifyCdn
            && !isCoverOrOg(url)
          ) {
            continue;
          }

          if (!(isNetlifyCdn || isLocalImageSrc(url) || isCoverOrOg(url)))
            continue;

          if (isSoftMediaStatus(status)) {
            console.warn(`[crawl] soft media ${status} on ${path}: ${url}`);
            continue;
          }
          if (isHardMediaStatus(status))
            badMedia.push(`${status} ${url}`);
        }

        expect(cloudinaryHits, `Cloudinary hits on ${path}`).toEqual([]);
        expect(badMedia, `broken media on ${path}`).toEqual([]);

        // Dim check for migrated masters under content/, blog/, and podcasts/.
        const missingDims = await page.locator('main img').evaluateAll((imgs) => {
          const isScoped = (src: string) => {
            let decoded = src;
            try {
              decoded = decodeURIComponent(src);
            }
            catch { /* keep raw */ }
            return (
              decoded.includes('/images/content/')
              || decoded.includes('/images/blog/')
              || decoded.includes('/images/podcasts/')
            );
          };
          return imgs
            .filter((img) => {
              const src = img.getAttribute('src') || '';
              return isScoped(src) && (!img.getAttribute('width') || !img.getAttribute('height'));
            })
            .map(img => img.getAttribute('src') || img.getAttribute('alt') || 'unknown');
        });
        expect(missingDims, `local /images/{content,blog,podcasts}/ imgs without width/height on ${path}`).toEqual([]);

        page.off('response', onResponse);
      }
    });
  }
});
