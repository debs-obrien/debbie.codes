import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, isCloudinaryBandwidthRequest, test } from './fixtures';

/**
 * Crawl every sitemap route and assert zero Cloudinary bandwidth requests,
 * no broken image/media responses, and width+height on <img> inside <main>.
 */
test.describe('No Cloudinary crawl', () => {
  test.use({ blockCloudinary: false });

  test('all sitemap routes make zero Cloudinary requests', async ({ page, baseURL }) => {
    const sitemapPath = join(process.cwd(), 'public/sitemap.xml');
    test.skip(!existsSync(sitemapPath), 'public/sitemap.xml missing');

    const xml = readFileSync(sitemapPath, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m => m[1]);
    expect(locs.length).toBeGreaterThan(10);

    const origin = (baseURL || 'http://127.0.0.1:8000').replace(/\/$/, '');
    const routes = locs.map((loc) => {
      try {
        return new URL(loc).pathname;
      }
      catch {
        return loc.replace(/^https?:\/\/[^/]+/, '') || '/';
      }
    });

    // Cap local runs; full set on CI / deploy preview
    const limit = process.env.CI || process.env.PLAYWRIGHT_TEST_BASE_URL ? routes.length : Math.min(routes.length, 40);
    const sample = routes.slice(0, limit);

    for (const path of sample) {
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
          if (
            url.includes('/images/content/')
            || url.includes('/images/blog/')
            || url.includes('/images/podcasts/')
            || (url.includes('/.netlify/images') && url.includes('/images/'))
            || (url.includes('/_ipx/') && url.includes('/images/'))
          ) {
            badMedia.push(`${res.status()} ${url}`);
          }
        }
      };
      page.on('response', onResponse);

      await page.goto(path.startsWith('http') ? path : `${origin}${path}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(300);

      expect(cloudinaryHits, `Cloudinary hits on ${path}`).toEqual([]);
      expect(badMedia, `broken media on ${path}`).toEqual([]);

      // Width/height required on local migrated assets (Cloudinary → /images/).
      // Third-party embeds (theaiplatform, Unsplash) are out of scope.
      const missingDims = await page.locator('main img').evaluateAll(imgs =>
        imgs
          .filter((img) => {
            const src = img.getAttribute('src') || '';
            const local = src.includes('/images/content/') || src.includes('/images/blog/') || src.includes('/images/podcasts/');
            return local && (!img.getAttribute('width') || !img.getAttribute('height'));
          })
          .map(img => img.getAttribute('src') || img.getAttribute('alt') || 'unknown')
      );
      expect(missingDims, `local imgs without width/height on ${path}`).toEqual([]);

      page.off('response', onResponse);
    }
  });
});
