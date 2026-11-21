import { expect, test } from './fixtures';

test.describe('404 Error Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/non-existent-page');
  });

  test('displays proper 404 page for non-existent routes', async ({ page }) => {
    await expect(page.locator('body')).toMatchAriaSnapshot(`
      - heading "Ooops looks like that page doesn't exist" [level=1]
      - paragraph: Sorry about that. No idea what went wrong but hey, nobody's perfect. Lets take you somewhere that actually exists. go.
      - link "Take me there!":
        - /url: /
      - img "broken connection"
    `);
  });

  test('unknown route returns HTTP 404 status (not 200)', async ({ request }) => {
    const res = await request.get('/non-existent-page-http-status-check');
    expect(res.status(), 'unknown routes should return HTTP 404').toBe(404);
  });

  test('404 page maintains header and footer navigation', async ({ page }) => {
    await expect(page.getByRole('banner').getByRole('navigation')).toMatchAriaSnapshot(`
      - navigation:
        - list:
          - listitem:
            - link "About":
              - /url: /about
          - listitem:
            - link "Speaking":
              - /url: /speaking
          - listitem:
            - link "Videos":
              - /url: /videos
          - listitem:
            - link "Podcasts":
              - /url: /podcasts
          - listitem:
            - link "Courses":
              - /url: /courses
          - listitem:
            - link "Blog":
              - /url: /blog
          - listitem:
            - link "Hire me":
              - /url: /hire-me
    `);

    await expect(page.getByRole('contentinfo').getByRole('list').first()).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "About":
            - /url: /about
        - listitem:
          - link "Speaking":
            - /url: /speaking
        - listitem:
          - link "Videos":
            - /url: /videos
        - listitem:
          - link "Podcasts":
            - /url: /podcasts
        - listitem:
          - link "Courses":
            - /url: /courses
        - listitem:
          - link "Blog":
            - /url: /blog
        - listitem:
          - link "Hire me":
            - /url: /hire-me
    `);
  });
});

// Separate describe: must not share beforeEach(/non-existent-page) navigation.
test.describe('Unknown blog tag hydration', () => {
  // Unknown tags are not prerendered: static hosts serve 404.html, then the SPA
  // hydrates the themed tag listing (live parity). Never Nuxt's default error UI.
  test('unknown blog tag hydrates themed listing with site header', async ({ page, request }) => {
    const path = '/blog/tags/zzz-none';
    const res = await request.get(path);
    // Static hosts (Netlify/Vercel) → 404; local nuxt dev may SSR 200. Either way
    // the hydrated document must keep site chrome, not Nuxt's default error page.
    expect([200, 404]).toContain(res.status());

    await page.goto(path);
    await expect(page).not.toHaveTitle(/404 - Page Not Found\s*\|\s*Nuxt/i);
    await expect(
      page.getByRole('banner').getByRole('link', { name: 'Debbie O\'Brien', exact: true })
    ).toBeVisible();
    await expect(page.getByText(/No articles found tagged with/i)).toBeVisible();
  });
});
