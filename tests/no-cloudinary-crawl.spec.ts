import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, isCloudinaryBandwidthRequest, test } from './fixtures';

/**
 * Crawl sitemap routes and assert zero Cloudinary bandwidth requests,
 * no broken image/media responses, and width+height on local <img>s.
 *
 * Split into parallel batches so each test stays well under the default
 * 30s Playwright timeout (a single 213-route loop exceeds it in CI).
 */

function sitemapRoutes(): string[] {
  const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
  if (!existsSync(sitemapPath))
    return [];
  const xml = readFileSync(sitemapPath, 'utf8');
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

/** Decode Netlify CDN query params (`url=%2Fimages%2F…`) before path checks. */
function decodeSrc(src: string): string {
  try {
    return decodeURIComponent(src);
  }
  catch {
    return src;
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

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size)
    out.push(items.slice(i, i + size));
  return out;
}

const allRoutes = sitemapRoutes();
// Cap local runs; full set on CI / deploy preview
const limit = process.env.CI || process.env.PLAYWRIGHT_TEST_BASE_URL
  ? allRoutes.length
  : Math.min(allRoutes.length, 40);
const sample = allRoutes.slice(0, limit);
const BATCH_SIZE = 12;
const batches = chunk(sample, BATCH_SIZE);

test.describe('No Cloudinary crawl', () => {
  test.use({ blockCloudinary: false });

  test.skip(allRoutes.length === 0, 'public/sitemap.xml missing');

  for (const [batchIndex, routes] of batches.entries()) {
    test(`sitemap batch ${batchIndex + 1}/${batches.length} (${routes.length} routes)`, async ({ page, baseURL }) => {
      // ~2–3s per route worst case; keep headroom for cold preview.
      test.setTimeout(Math.max(60_000, routes.length * 8_000));

      const origin = (baseURL || 'http://127.0.0.1:8000').replace(/\/$/, '');

      for (const path of routes) {
        const cloudinaryHits: string[] = [];
        const badMedia: string[] = [];

        const onResponse = (res: import('@playwright/test').Response) => {
          const url = res.url();
          if (isCloudinaryBandwidthRequest(url))
            cloudinaryHits.push(url);
          const type = res.request().resourceType();
          // Flag broken local / Netlify Image CDN assets. Pre-existing Unsplash
          // IPX 403s are out of scope for this migration.
          if ((type === 'image' || type === 'media') && res.status() >= 400) {
            if (isLocalImageSrc(url) || url.includes('/.netlify/images') || url.includes('/_ipx/')) {
              // Only fail when the proxied source is a local /images/ asset.
              if (isLocalImageSrc(url))
                badMedia.push(`${res.status()} ${url}`);
            }
          }
        };
        page.on('response', onResponse);

        await page.goto(path.startsWith('http') ? path : `${origin}${path}`, {
          waitUntil: 'domcontentloaded',
          timeout: 30_000
        });
        // Brief settle for lazy images / NuxtImg swaps
        await page.waitForTimeout(150);

        expect(cloudinaryHits, `Cloudinary hits on ${path}`).toEqual([]);
        expect(badMedia, `broken media on ${path}`).toEqual([]);

        // Dim check only for migrated /images/content/ masters (not older /images/blog/).
        const missingDims = await page.locator('main img').evaluateAll((imgs) => {
          const isMigrated = (src: string) => {
            let decoded = src;
            try {
              decoded = decodeURIComponent(src);
            }
            catch { /* keep raw */ }
            return decoded.includes('/images/content/');
          };
          return imgs
            .filter((img) => {
              const src = img.getAttribute('src') || '';
              return isMigrated(src) && (!img.getAttribute('width') || !img.getAttribute('height'));
            })
            .map(img => img.getAttribute('src') || img.getAttribute('alt') || 'unknown');
        });
        expect(missingDims, `migrated /images/content/ imgs without width/height on ${path}`).toEqual([]);

        page.off('response', onResponse);
      }
    });
  }
});
