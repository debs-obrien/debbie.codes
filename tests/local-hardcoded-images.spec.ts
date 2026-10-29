import { resolveOgImage } from '../utils/og-image';
import { expect, test } from './fixtures';

test.describe('Local hard-coded images (Cloudinary offload)', () => {
  test('topbar avatar is served from the site, not Cloudinary', async ({ page }) => {
    await page.goto('/');

    const avatar = page.getByRole('banner').locator('img.profile-pic');
    await expect(avatar).toBeVisible();

    const src = await avatar.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src!).not.toMatch(/res\.cloudinary\.com/i);
    expect(src!).toMatch(/debbie-thumb/);

    // Same assets resolve to absolute Netlify Image CDN OG URLs (1200×630 JPEG).
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

