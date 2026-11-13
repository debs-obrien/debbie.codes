import { expect, test } from './fixtures';

/**
 * content/blog/unpublished-filter-fixture.md is a test-only post kept at
 * published: false. These assertions guard the published filter: unpublished
 * posts stay out of /blog and 404 at their URL.
 */
const UNPUBLISHED_PATH = '/blog/unpublished-filter-fixture';
const UNPUBLISHED_TITLE = /Unpublished Filter Fixture \(Do Not Publish\)/i;

test.describe('Unpublished blog posts', () => {
  test('are not listed on /blog', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('article').first()).toBeVisible();

    await expect(page.locator(`a[href="${UNPUBLISHED_PATH}"]`)).toHaveCount(0);
    await expect(page.getByRole('link', { name: UNPUBLISHED_TITLE })).toHaveCount(0);
  });

  test('return HTTP 404 at their URL and do not render the post', async ({ page, request }) => {
    const res = await request.get(UNPUBLISHED_PATH);
    expect(res.status(), 'unpublished posts should return HTTP 404').toBe(404);

    await page.goto(UNPUBLISHED_PATH);
    await expect(page.getByRole('heading', {
      name: /Ooops looks like that page doesn't exist/i
    })).toBeVisible();
    await expect(page.getByRole('heading', {
      name: UNPUBLISHED_TITLE
    })).toHaveCount(0);
  });

  test('are absent from llms files and have no markdown copy', async ({ request }) => {
    for (const path of ['/llms.txt', '/llms-full.txt']) {
      const res = await request.get(path);
      expect(res.status()).toBe(200);
      const body = await res.text();
      expect(body, path).not.toContain('unpublished-filter-fixture');
      expect(body, path).not.toContain('Unpublished Filter Fixture (Do Not Publish)');
    }
    const md = await request.get(`${UNPUBLISHED_PATH}.md`);
    expect(md.status(), 'unpublished markdown copy must 404').toBe(404);
  });
});
