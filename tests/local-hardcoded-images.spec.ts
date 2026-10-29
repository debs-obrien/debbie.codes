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

    // Same assets resolve to local absolute URLs for OG/Twitter cards.
    expect(resolveOgImage('v1589118478/debbie.codes/debbie-thumb_clt00n'))
      .toBe('https://debbie.codes/images/debbie-thumb.webp');
    expect(resolveOgImage('v1668347473/debbie.codes/broken_vktobk.png'))
      .toBe('https://debbie.codes/images/broken-connection.webp');
    expect(resolveOgImage('https://res.cloudinary.com/debsobrien/image/upload/c_thumb,w_200/v1768895680/debbie.codes/podcasts/alexusadays-future-of-testing'))
      .toBe('https://debbie.codes/images/podcasts/alexusadays-future-of-testing.webp');
  });
});
