import process from 'node:process';
import { resolveOgImage } from '../utils/og-image';
import { expect, test } from './fixtures';

test.describe('Local hard-coded images (dual-host delivery)', () => {
  test('topbar avatar uses the site asset id (Netlify CDN or Cloudinary on Vercel)', async ({ page }) => {
    await page.goto('/');

    const avatar = page.getByRole('banner').locator('img.profile-pic');
    await expect(avatar).toBeVisible();

    const src = await avatar.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src!).toMatch(/debbie-thumb/);
    if (/res\.cloudinary\.com/i.test(src!)) {
      expect(src!).toMatch(/f_auto/);
      expect(src!).toMatch(/debbie\.codes\/debbie-thumb/);
    }
    else {
      // Netlify Image CDN, IPX, or static — never a raw Cloudinary URL on Netlify builds.
      expect(src!).not.toMatch(/res\.cloudinary\.com/i);
    }
  });

  test('resolveOgImage maps legacy public IDs to Netlify CDN when not on Vercel', () => {
    test.skip(Boolean(process.env.VERCEL), 'VERCEL set — Cloudinary OG path');

    for (const [input, fragment] of [
      ['v1589118478/debbie.codes/debbie-thumb_clt00n', 'debbie-thumb'],
      ['v1668347473/debbie.codes/broken_vktobk.png', 'broken-connection'],
      ['https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_200/v1768895680/debbie.codes/podcasts/alexusadays-future-of-testing', 'alexusadays-future-of-testing'],
    ] as const) {
      const url = resolveOgImage(input);
      expect(url).toMatch(/^https:\/\/debbie\.codes\/\.netlify\/images\?/);
      expect(url).toContain(fragment);
      expect(url).not.toMatch(/res\.cloudinary\.com/);
    }
  });
});
