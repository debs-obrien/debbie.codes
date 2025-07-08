import { expect, test } from '@playwright/test';

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

  test('404 page maintains header and footer navigation', async ({ page }) => {
    await expect(page.getByRole('banner').getByRole('navigation')).toMatchAriaSnapshot(`
      - navigation:
        - list:
          - listitem:
            - link "About":
              - /url: /about
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
    `);
    
    await expect(page.getByRole('contentinfo').getByRole('list').first()).toMatchAriaSnapshot(`
      - list:
        - listitem:
          - link "About":
            - /url: /about
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
    `);
  });
});
