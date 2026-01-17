import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('About page - Displays hero section with greeting and title', async ({ page }) => {
    await test.step('Verify page title and URL', async () => {
      await expect(page).toHaveTitle('About Debbie and her experience as a developer · Debbie Codes');
      await expect(page).toHaveURL('/about');
    });

    await test.step('Verify hero section content', async () => {
      await expect(page.getByText('👋 Hello There!')).toBeVisible();
      await expect(page.getByRole('heading', { name: "I'm Debbie O'Brien", level: 1 })).toBeVisible();
    });
  });

  test('About page - Displays biographical content', async ({ page }) => {
    await test.step('Verify professional background paragraph', async () => {
      const bioParagraph = page.getByText('With over 15 years experience in Frontend development');
      await expect(bioParagraph).toBeVisible();
      await expect(bioParagraph).toContainText('Tech Lead and consultant');
      await expect(bioParagraph).toContainText('Vue School');
      await expect(bioParagraph).toContainText('Jamstack Explorers');
    });

    await test.step('Verify current role and achievements', async () => {
      await expect(page.getByText('Senior Staff Developer Relations Engineer, Applied AI at Block')).toBeVisible();
      await expect(page.getByText('Google Developer Expert in web technologies')).toBeVisible();
      await expect(page.getByText('Nuxt Ambassador')).toBeVisible();
    });

  });

  test('About page - Displays awards and achievements section', async ({ page }) => {
    await test.step('Verify awards section heading', async () => {
      await expect(page.getByRole('heading', { name: 'Awards & Achievements', level: 2 })).toBeVisible();
      await expect(page.getByText('Recognition and certifications that reflect my journey')).toBeVisible();
    });

    await test.step('Verify awards section structure', async () => {
      await expect(page.getByRole('region')).toMatchAriaSnapshot(`
        - region:
          - list:
            - article:
              - img
              - heading "Learn more about GitHub Star Alumni (opens in new tab)" [level=3]:
                - link "Learn more about GitHub Star Alumni (opens in new tab)":
                  - /url: https://stars.github.com/alumni/
                  - text: GitHub Star Alumni
                  - img
              - paragraph
              - link "Learn more about GitHub Star Alumni (opens in new tab)":
                - /url: https://stars.github.com/alumni/
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Google Developer Expert (opens in new tab)" [level=3]:
                - link "Learn more about Google Developer Expert (opens in new tab)":
                  - /url: https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien
                  - text: Google Developer Expert
                  - img
              - paragraph
              - link "Learn more about Google Developer Expert (opens in new tab)":
                - /url: https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Former Microsoft Most Valuable Professional (opens in new tab)" [level=3]:
                - link "Learn more about Former Microsoft Most Valuable Professional (opens in new tab)":
                  - /url: https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien
                  - text: Former Microsoft Most Valuable Professional
                  - img
              - paragraph
              - link "Learn more about Former Microsoft Most Valuable Professional (opens in new tab)":
                - /url: https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Media Developer Expert (opens in new tab)" [level=3]:
                - link "Learn more about Media Developer Expert (opens in new tab)":
                  - /url: https://cloudinary.com/mde
                  - text: Media Developer Expert
                  - img
              - paragraph
              - link "Learn more about Media Developer Expert (opens in new tab)":
                - /url: https://cloudinary.com/mde
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Auth0 Ambassador (opens in new tab)" [level=3]:
                - link "Learn more about Auth0 Ambassador (opens in new tab)":
                  - /url: https://auth0.com/ambassador-program/
                  - text: Auth0 Ambassador
                  - img
              - paragraph
              - link "Learn more about Auth0 Ambassador (opens in new tab)":
                - /url: https://auth0.com/ambassador-program/
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Microsoft Certified (opens in new tab)" [level=3]:
                - link "Learn more about Microsoft Certified (opens in new tab)":
                  - /url: https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377
                  - text: Microsoft Certified
                  - img
              - paragraph
              - link "Learn more about Microsoft Certified (opens in new tab)":
                - /url: https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Bachelor's Level Diploma (opens in new tab)" [level=3]:
                - link "Learn more about Bachelor's Level Diploma (opens in new tab)":
                  - /url: https://openclassrooms.com/en/paths/315-front-end-developer
                  - text: Bachelor's Level Diploma
                  - img
              - paragraph
              - link "Learn more about Bachelor's Level Diploma (opens in new tab)":
                - /url: https://openclassrooms.com/en/paths/315-front-end-developer
                - text: Learn More
                - img
            - article:
              - img
              - heading "Learn more about Full Stack JavaScript Tech Degree (opens in new tab)" [level=3]:
                - link "Learn more about Full Stack JavaScript Tech Degree (opens in new tab)":
                  - /url: https://teamtreehouse.com/techdegree
                  - text: Full Stack JavaScript Tech Degree
                  - img
              - paragraph
              - link "Learn more about Full Stack JavaScript Tech Degree (opens in new tab)":
                - /url: https://teamtreehouse.com/techdegree
                - text: Learn More
                - img
      `);
    });
  });

  test('About page - Validates award article count and links', async ({ page }) => {
    await test.step('Count award articles', async () => {
      const articles = page.getByRole('region').getByRole('article');
      await expect(articles).toHaveCount(8);
    });

    await test.step('Verify external award links', async () => {
      // GitHub Star Alumni
      await expect(page.getByRole('link', { name: 'Learn more about GitHub Star Alumni (opens in new tab)' }).first()).toHaveAttribute('href', 'https://stars.github.com/alumni/');
      
      // Google Developer Expert
      await expect(page.getByRole('link', { name: 'Learn more about Google Developer Expert (opens in new tab)' }).first()).toHaveAttribute('href', 'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien');
      
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

    await test.step('Verify educational platform links', async () => {
      await expect(page.getByRole('link', { name: 'Vue School' })).toHaveAttribute('href', 'https://vueschool.io/courses/internationalization-with-vue-i18n');
      await expect(page.getByRole('link', { name: 'Jamstack Explorers' })).toHaveAttribute('href', 'https://explorers.netlify.com/learn/get-started-with-nuxt');
      await expect(page.getByRole('link', { name: 'Ultimate Courses' })).toHaveAttribute('href', 'https://ultimatecourses.com/author/debbieobrien');
    });
  });
});
