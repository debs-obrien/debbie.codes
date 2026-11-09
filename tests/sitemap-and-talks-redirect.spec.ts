import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { expect, test } from './fixtures';

const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim();
const isEndform = process.env.ENDFORM === 'true';
const redirectsPath = resolve('public/_redirects');

test.describe('Sitemap and /talks redirect', () => {
  test('/sitemap.xml returns a real sitemap with key routes', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body).toContain('<urlset');
    expect(body).toContain('https://debbie.codes/speaking');
    expect(body).toContain('https://debbie.codes/blog');
    expect(body).toContain('https://debbie.codes/videos');
    expect(body).toContain('https://debbie.codes/podcasts');
    expect(body).toContain('https://debbie.codes/courses');
    expect(body).toContain('https://debbie.codes/about');
    expect(body).toContain('https://debbie.codes/now');
    expect(body).toContain('https://debbie.codes/hire-me');
    // At least one content blog URL from the collection
    expect(body).toMatch(/https:\/\/debbie\.codes\/blog\/[a-z0-9-]+/);
  });

  test('_redirects declares forced permanent /talks → /speaking', { tag: '@smoke' }, () => {
    // Endform runners execute from /tmp without the repo checkout, so
    // public/_redirects is not on disk (ENOENT). Skip the filesystem
    // assertion there; HTTP 3xx checks below still cover deploy previews.
    // GHA/local keep the assert whenever the file is present.
    test.skip(
      isEndform || !existsSync(redirectsPath),
      'public/_redirects is not available on Endform runners (no repo checkout)'
    );

    const redirects = readFileSync(redirectsPath, 'utf8');
    // Force (!) so Netlify cannot soft-serve / rewrite over the 301.
    expect(redirects).toMatch(/^\/talks\s+\/speaking\s+301!\s*$/m);
    expect(redirects).toMatch(/^\/talks\/\s+\/speaking\s+301!\s*$/m);
    // More specific rule must appear before the general /talks rules.
    expect(redirects.indexOf('/talks/devsum-2026')).toBeLessThan(redirects.indexOf('/talks /speaking'));
  });

  test('_redirects merges singular interview tag into interviews', { tag: '@smoke' }, () => {
    test.skip(
      isEndform || !existsSync(redirectsPath),
      'public/_redirects is not available on Endform runners (no repo checkout)'
    );

    const redirects = readFileSync(redirectsPath, 'utf8');
    expect(redirects).toMatch(/^\/videos\/tags\/interview\s+\/videos\/tags\/interviews\s+301\s*$/m);
  });

  test('_redirects sends duplicate MCP beginner post to canonical slug', { tag: '@smoke' }, () => {
    test.skip(
      isEndform || !existsSync(redirectsPath),
      'public/_redirects is not available on Endform runners (no repo checkout)'
    );

    const redirects = readFileSync(redirectsPath, 'utf8');
    expect(redirects).toMatch(
      /^\/blog\/building-your-first-mcp-server\s+\/blog\/building-your-first-mcp-server-a-beginners-tutorial\s+301\s*$/m
    );
  });

  test('sitemap lists canonical MCP beginner tutorial only', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body).toContain('https://debbie.codes/blog/building-your-first-mcp-server-a-beginners-tutorial');
    expect(body).not.toMatch(/https:\/\/debbie\.codes\/blog\/building-your-first-mcp-server<\/loc>/);
  });

  test('sitemap lists interviews tag, not singular interview', async ({ request }) => {
    const res = await request.get('/sitemap.xml');
    expect(res.status()).toBe(200);

    const body = await res.text();
    expect(body).toContain('https://debbie.codes/videos/tags/interviews');
    expect(body).not.toMatch(/https:\/\/debbie\.codes\/videos\/tags\/interview<\/loc>/);
  });

  test('deploy preview: /talks and /talks/ return 3xx to /speaking', async ({ request }) => {
    test.skip(!externalBaseURL, 'Netlify _redirects only apply on static hosting (deploy preview)');

    for (const path of ['/talks', '/talks/']) {
      const res = await request.get(path, { maxRedirects: 0 });
      expect([301, 302, 308], path).toContain(res.status());
      expect(res.headers().location, path).toMatch(/\/speaking\/?$/);
    }
  });
});
