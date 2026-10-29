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

/** True when src is a local /images/... asset (content, blog, podcasts). */
function isLocalImageSrc(src: string): boolean {
  const decoded = decodeSrc(src);
  return (
    decoded.includes('/images/content/')
    || decoded.includes('/images/blog/')
    || decoded.includes('/images/podcasts/')
  );
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
          // Flag broken local masters and any Netlify Image CDN 4xx (including
          // remote_images allowlist misses). Pre-existing Unsplash IPX 403s are
          // out of scope for this migration.
          if ((type === 'image' || type === 'media') && res.status() >= 400) {
            if (url.includes('/.netlify/images') || isLocalImageSrc(url))
              badMedia.push(`${res.status()} ${url}`);
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
