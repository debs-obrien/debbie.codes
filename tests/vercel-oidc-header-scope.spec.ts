/**
 * Prove Vercel OIDC is scoped to *.vercel.app and never attached to third parties.
 */
import type { APIRequestContext } from '@playwright/test';
import {
  expect,
  isVercelAppHost,
  test,
  VERCEL_OIDC_HEADER,
  wrapApiRequestWithVercelOidc
} from './fixtures';

const FAKE_OIDC = 'test-oidc-token-not-for-production';

test.describe('Vercel OIDC header scope', () => {
  test.use({
    vercelOidcToken: FAKE_OIDC,
    // Keep third-party probes transparent (no Cloudinary fulfill).
    blockCloudinary: false
  });

  test('isVercelAppHost matches only vercel.app hosts', () => {
    expect(isVercelAppHost('https://debbie-codes-git-main.vercel.app/blog')).toBe(true);
    expect(isVercelAppHost('https://something.vercel.app')).toBe(true);
    expect(isVercelAppHost('https://www.youtube.com/iframe_api')).toBe(false);
    expect(isVercelAppHost('https://res.cloudinary.com/demo/image/upload/x')).toBe(false);
    expect(isVercelAppHost('https://debbie.codes/')).toBe(false);
  });

  test('wrapApiRequestWithVercelOidc adds OIDC only for vercel.app (request + page.request)', async () => {
    const calls: { url: string, headers?: Record<string, string> }[] = [];
    const mock = {
      async get(url: string, options?: { headers?: Record<string, string> }) {
        calls.push({ url, headers: options?.headers });
        return { ok: () => true } as never;
      }
    } as unknown as APIRequestContext;

    const wrapped = wrapApiRequestWithVercelOidc(mock, FAKE_OIDC);
    await wrapped.get('https://www.youtube.com/iframe_api');
    await wrapped.get('https://res.cloudinary.com/demo/image/upload/x');
    await wrapped.get('https://oidc-scope-probe.vercel.app/prefetch.js');

    expect(calls[0]?.headers?.[VERCEL_OIDC_HEADER], 'YouTube API must not get OIDC').toBeUndefined();
    expect(calls[1]?.headers?.[VERCEL_OIDC_HEADER], 'Cloudinary API must not get OIDC').toBeUndefined();
    expect(calls[2]?.headers?.[VERCEL_OIDC_HEADER], 'vercel.app API must get OIDC').toBe(FAKE_OIDC);

    // Relative URL + vercel.app baseURL (webmcp page.request prefetch on a preview).
    const withBase = wrapApiRequestWithVercelOidc(
      mock,
      FAKE_OIDC,
      'https://preview.vercel.app'
    );
    await withBase.get('/_nuxt/entry.js');
    expect(calls.at(-1)?.headers?.[VERCEL_OIDC_HEADER]).toBe(FAKE_OIDC);
  });

  test('browser requests do not send OIDC to non-vercel.app hosts', async ({ page }) => {
    const captured: Record<string, string | undefined> = {};

    await page.route('https://www.youtube.com/**', async (route) => {
      captured.youtube = route.request().headers()[VERCEL_OIDC_HEADER];
      await route.fulfill({ status: 204, body: '' });
    });
    await page.route('https://res.cloudinary.com/**', async (route) => {
      captured.cloudinary = route.request().headers()[VERCEL_OIDC_HEADER];
      await route.fulfill({ status: 204, body: '' });
    });

    await page.goto('about:blank');
    await page.evaluate(async () => {
      await fetch('https://www.youtube.com/iframe_api').catch(() => {});
      await fetch('https://res.cloudinary.com/demo/image/upload/sample').catch(() => {});
    });

    expect(captured.youtube, 'YouTube must not receive OIDC').toBeUndefined();
    expect(captured.cloudinary, 'Cloudinary must not receive OIDC').toBeUndefined();
  });
});
