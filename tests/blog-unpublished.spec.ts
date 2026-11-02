import { expect, test } from './fixtures';

/**
 * content/blog/webmcp-on-my-site.md is intentionally unpublished
 * (published: false) until Debbie reviews it. These assertions guard the
 * published filter: unpublished posts stay out of /blog and 404 at their URL.
 */
const UNPUBLISHED_PATH = '/blog/webmcp-on-my-site';

test.describe('Unpublished blog posts', () => {
  test('are not listed on /blog', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('article').first()).toBeVisible();

    await expect(page.locator(`a[href="${UNPUBLISHED_PATH}"]`)).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Adding WebMCP to My Site/i })).toHaveCount(0);
  });

  test('return HTTP 404 at their URL and do not render the post', async ({ page, request }) => {
    const res = await request.get(UNPUBLISHED_PATH);
    expect(res.status(), 'unpublished posts should return HTTP 404').toBe(404);

    await page.goto(UNPUBLISHED_PATH);
    await expect(page.getByRole('heading', {
      name: /Ooops looks like that page doesn't exist/i,
    })).toBeVisible();
    await expect(page.getByRole('heading', {
      name: /Adding WebMCP to My Site/i,
    })).toHaveCount(0);
  });
});
