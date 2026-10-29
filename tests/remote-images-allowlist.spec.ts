import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import {
  matchesNetlifyRemoteImagePattern,
  NETLIFY_REMOTE_IMAGE_HOSTS,
  netlifyRemoteImagePatterns
} from '../utils/remote-images';
import { expect, test } from './fixtures';

const tomlPath = join(process.cwd(), 'netlify.toml');

test('NETLIFY_REMOTE_IMAGE_HOSTS matches netlify.toml remote_images', () => {
  // Endform stages netlify.toml via endform.config.ts additionalFiles; skip if absent.
  test.skip(!existsSync(tomlPath), 'netlify.toml not staged on this runner');

  const toml = readFileSync(tomlPath, 'utf8');
  const block = toml.match(/remote_images\s*=\s*\[([\s\S]*?)\]/);
  expect(block, 'remote_images array in netlify.toml').toBeTruthy();
  // Docs prefer single-quoted literal regex (no double-backslash escaping).
  const fromToml = [...block![1].matchAll(/'([^']+)'/g)].map(m => m[1]).sort();
  const fromModule = [...netlifyRemoteImagePatterns()].sort();
  expect(fromModule).toEqual(fromToml);

  // Patterns must be derived from the hostname list (single source of truth).
  for (const host of NETLIFY_REMOTE_IMAGE_HOSTS) {
    expect(fromToml.some(p => p.includes(host.replace(/\./g, '\\.')))).toBe(true);
  }
});

test('remote_images patterns reject hostname substring spoof', () => {
  const patterns = netlifyRemoteImagePatterns();
  // Allowed host used as a query-string substring must NOT match.
  expect(
    matchesNetlifyRemoteImagePattern(
      'https://www.netlify.com/favicon.ico?x=theaiplatform.app',
      patterns
    )
  ).toBe(false);
  // Real allowlisted URLs still match.
  expect(
    matchesNetlifyRemoteImagePattern(
      'https://theaiplatform.app/blog/an-agent-that-hunts-bugs-while-i-sleep/loop-diagram.png',
      patterns
    )
  ).toBe(true);
  expect(
    matchesNetlifyRemoteImagePattern(
      'https://dev-to-uploads.s3.amazonaws.com/uploads/articles/3hj38yxohffpm2zn40sw.png',
      patterns
    )
  ).toBe(true);
  expect(
    matchesNetlifyRemoteImagePattern(
      'https://raw.githubusercontent.com/debs-obrien/learn-agent-skills/main/assets/before-vs-after.png',
      patterns
    )
  ).toBe(true);
});
