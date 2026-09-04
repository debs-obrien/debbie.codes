import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('About page - Displays hero section with greeting and title', async ({ page }) => {
    await test.step('Verify page title and URL', async () => {
      await expect(page).toHaveTitle('About Debbie and her experience as a developer · Debbie Codes');
      await expect(page).toHaveURL(/\/about\/?$/);
    });

    await test.step('Verify hero section content', async () => {
      await expect(page.getByText('About', { exact: true }).first()).toBeVisible();
      await expect(page.getByRole('heading', { name: /I'm Debbie O'Brien/i, level: 1 })).toBeVisible();
    });
  });

  test('About page - Displays biographical content', async ({ page }) => {
    await test.step('Verify professional background paragraph', async () => {
      const bioParagraph = page.getByText('With over 15 years in frontend development');
      await expect(bioParagraph).toBeVisible();
      await expect(bioParagraph).toContainText('performance and testing');
      await expect(bioParagraph).toContainText('AI agents');
    });

    await test.step('Verify role and achievements', async () => {
      // Bio + awards section both mention GDE — scope to the bio content renderer
      await expect(page.locator('.prose').getByText(/I help people work with AI agents/)).toBeVisible();
      await expect(page.locator('.prose').getByText(/I build and use multi-agent workflows every day/)).toBeVisible();
      await expect(page.locator('.prose').getByText(/Zephyr Cloud/)).toBeVisible();
      await expect(page.getByRole('link', { name: /Zephyr/i })).toHaveCount(0);
      await expect(page.locator('.prose').getByText(/Senior Staff Developer Relations Engineer, Applied AI at Block/)).toBeVisible();
      await expect(page.locator('.prose').getByText(/Principal Technical Program Manager at Microsoft, focused on Playwright/)).toBeVisible();
      await expect(page.locator('.prose').getByText(/Google Developer Expert in web technologies/)).toBeVisible();
      await expect(page.locator('.prose').getByText(/former Microsoft MVP, Cloudinary Media Developer Expert, and GitHub Star/)).toBeVisible();
    });

  });

  test('About page - Displays awards and achievements section', async ({ page }) => {
    await test.step('Verify awards section heading', async () => {
      await expect(page.getByRole('heading', { name: 'Awards & Achievements', level: 2 })).toBeVisible();
      await expect(page.getByText('Recognition and certifications that reflect my journey')).toBeVisible();
    });

    await test.step('Verify awards section structure', async () => {
      // Region is named via aria-labelledby="awards-heading". Snapshot the
      // structure (named region, listitems, heading/link names) without full
      // paragraph copy so award blurb edits do not break the test.
      await expect(page.getByRole('region', { name: 'Awards & Achievements' })).toMatchAriaSnapshot(`
        - region "Awards & Achievements":
          - list:
            - listitem:
              - article:
                - heading "Learn more about GitHub Star Alumni (opens in new tab)" [level=3]:
                  - link "Learn more about GitHub Star Alumni (opens in new tab)":
                    - /url: https://stars.github.com/alumni/
                    - text: GitHub Star Alumni
                - paragraph
                - link "About GitHub Star Alumni":
                  - /url: https://stars.github.com/alumni/
            - listitem:
              - article:
                - heading "Learn more about Google Developer Expert (opens in new tab)" [level=3]:
                  - link "Learn more about Google Developer Expert (opens in new tab)":
                    - /url: https://me.developers.google.com/u/115790798136433531532
                    - text: Google Developer Expert
                - paragraph
                - link "About Google Developer Expert":
                  - /url: https://me.developers.google.com/u/115790798136433531532
            - listitem:
              - article:
                - heading "Learn more about Former Microsoft Most Valuable Professional (opens in new tab)" [level=3]:
                  - link "Learn more about Former Microsoft Most Valuable Professional (opens in new tab)":
                    - /url: https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien
                    - text: Former Microsoft Most Valuable Professional
                - paragraph
                - link "About Former Microsoft Most Valuable Professional":
                  - /url: https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien
            - listitem:
              - article:
                - heading "Learn more about Nuxt Ambassador (opens in new tab)" [level=3]:
                  - link "Learn more about Nuxt Ambassador (opens in new tab)":
                    - /url: https://nuxtjs.org/teams/
                    - text: Nuxt Ambassador
                - paragraph
                - link "About Nuxt Ambassador":
                  - /url: https://nuxtjs.org/teams/
            - listitem:
              - article:
                - heading "Learn more about Media Developer Expert (opens in new tab)" [level=3]:
                  - link "Learn more about Media Developer Expert (opens in new tab)":
                    - /url: https://cloudinary.com/mde
                    - text: Media Developer Expert
                - paragraph
                - link "About Media Developer Expert":
                  - /url: https://cloudinary.com/mde
            - listitem:
              - article:
                - heading "Learn more about Auth0 Ambassador (opens in new tab)" [level=3]:
                  - link "Learn more about Auth0 Ambassador (opens in new tab)":
                    - /url: https://auth0.com/ambassador-program/
                    - text: Auth0 Ambassador
                - paragraph
                - link "About Auth0 Ambassador":
                  - /url: https://auth0.com/ambassador-program/
            - listitem:
              - article:
                - heading "Learn more about Microsoft Certified (opens in new tab)" [level=3]:
                  - link "Learn more about Microsoft Certified (opens in new tab)":
                    - /url: https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377
                    - text: Microsoft Certified
                - paragraph
                - link "About Microsoft Certified":
                  - /url: https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377
            - listitem:
              - article:
                - heading "Learn more about Bachelor's Level Diploma (opens in new tab)" [level=3]:
                  - link "Learn more about Bachelor's Level Diploma (opens in new tab)":
                    - /url: https://openclassrooms.com/en/paths/315-front-end-developer
                    - text: Bachelor's Level Diploma
                - paragraph
                - link "About Bachelor's Level Diploma":
                  - /url: https://openclassrooms.com/en/paths/315-front-end-developer
            - listitem:
              - article:
                - heading "Learn more about Full Stack JavaScript Tech Degree (opens in new tab)" [level=3]:
                  - link "Learn more about Full Stack JavaScript Tech Degree (opens in new tab)":
                    - /url: https://teamtreehouse.com/techdegree
                    - text: Full Stack JavaScript Tech Degree
                - paragraph
                - link "About Full Stack JavaScript Tech Degree":
                  - /url: https://teamtreehouse.com/techdegree
      `);
    });
  });

  test('About page - Validates award article count and links', async ({ page }) => {
    await test.step('Count award articles', async () => {
      const articles = page.getByRole('region', { name: 'Awards & Achievements' }).getByRole('article');
      await expect(articles).toHaveCount(9);
    });

    await test.step('Verify external award links', async () => {
      // GitHub Star Alumni
      await expect(page.getByRole('link', { name: 'Learn more about GitHub Star Alumni (opens in new tab)' }).first()).toHaveAttribute('href', 'https://stars.github.com/alumni/');
      
      // Google Developer Expert
      await expect(page.getByRole('link', { name: 'Learn more about Google Developer Expert (opens in new tab)' }).first()).toHaveAttribute('href', 'https://me.developers.google.com/u/115790798136433531532');
      
      // Microsoft MVP
      await expect(page.getByRole('link', { name: 'Learn more about Former Microsoft Most Valuable Professional (opens in new tab)' }).first()).toHaveAttribute('href', 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien');
      
      // Media Developer Expert
      await expect(page.getByRole('link', { name: 'Learn more about Media Developer Expert (opens in new tab)' }).first()).toHaveAttribute('href', 'https://cloudinary.com/mde');
    });
  });


  test('About page - External profile links work correctly', async ({ page }) => {
    await test.step('Verify YouTube channel link', async () => {
      const youtubeLink = page.getByRole('link', { name: 'YouTube Channel' });
      await expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');
    });

    await test.step('Verify contact email', async () => {
      await expect(page.getByRole('link', { name: 'email me' })).toHaveAttribute('href', 'mailto:dobriendev@gmail.com');
    });

    await test.step('Verify headshot is visible', async () => {
      await expect(page.getByRole('main').getByRole('img', { name: 'Debbie O\'Brien' })).toBeVisible();
    });
  });
});
