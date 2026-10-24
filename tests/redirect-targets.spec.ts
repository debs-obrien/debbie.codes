import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import process from 'node:process';
import { expect, test } from '@playwright/test';

const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim();
const isEndform = process.env.ENDFORM === 'true';
const redirectsPath = resolve('public/_redirects');

// Targets that are already broken on main. Each needs a fix in public/_redirects
// (follow-up PR); remove the entry here when it is fixed. Don't add to this list.
const KNOWN_BROKEN_TARGETS = new Set([
  '/blog/1',
  '/blog/2',
  '/blog/lifestyle/1',
  '/blog/lifestyle/2',
  '/blog/tags/lifestyle',
  '/podcasts/desarrollo-nuxtjs',
  '/resources/tips'
]);

function internalTargets(): string[] {
  const targets = readFileSync(redirectsPath, 'utf8')
    .split('\n')
    .map(line => line.trim().split(/\s+/))
    .filter(([from, to]) => from && !from.startsWith('#') && to?.startsWith('/'))
    .map(([, to]) => to);
  return [...new Set(targets)];
}

test.describe('_redirects targets', () => {
  test('every internal redirect target returns 200 on the deployed site', async ({ request }) => {
    // Netlify applies _redirects only on the deployed site, and Endform runners
    // have no repo checkout to read public/_redirects from.
    test.skip(!externalBaseURL, 'Netlify _redirects only apply on static hosting (deploy preview)');
    test.skip(isEndform || !existsSync(redirectsPath), 'public/_redirects is not available on Endform runners (no repo checkout)');

    const targets = internalTargets();
    expect(targets.length).toBeGreaterThan(0);
    for (const known of KNOWN_BROKEN_TARGETS)
      expect.soft(targets, `${known} is no longer a redirect target: remove it from KNOWN_BROKEN_TARGETS`).toContain(known);

    for (const target of targets) {
      const res = await request.get(target);
      if (KNOWN_BROKEN_TARGETS.has(target))
        expect.soft(res.status(), `${target} is fixed: remove it from KNOWN_BROKEN_TARGETS`).not.toBe(200);
      else
        expect.soft(res.status(), `_redirects target ${target}`).toBe(200);
    }
  });
});
