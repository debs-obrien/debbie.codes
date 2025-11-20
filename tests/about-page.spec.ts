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
      await expect(page.getByText('Available for speaking & consulting')).toBeVisible();
      await expect(page.getByRole('heading', { level: 1 })).toContainText("Hi, I'm");
      await expect(page.getByRole('heading', { level: 1 })).toContainText("Debbie O'Brien");
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
      await expect(page.getByText('Principal Technical Program manager at Microsoft')).toBeVisible();
      await expect(page.getByText('Google Developer Expert in web technologies')).toBeVisible();
      await expect(page.getByText('Nuxt Ambassador')).toBeVisible();
    });

  });

  test('About page - Displays awards and achievements section', async ({ page }) => {
    await test.step('Verify awards section heading', async () => {
      await expect(page.getByRole('heading', { name: 'Awards & Achievements', level: 2 })).toBeVisible();
      await expect(page.getByText('Recognition and certifications that reflect my journey')).toBeVisible();
    });

    await test.step('Verify awards cards display correctly', async () => {
      // Verify GitHub Star Alumni award
      const githubStarArticle = page.getByRole('article').filter({ hasText: 'GitHub Star Alumni' });
      await expect(githubStarArticle).toBeVisible();
      await expect(githubStarArticle.getByRole('heading', { name: 'GitHub Star Alumni', level: 3 })).toBeVisible();

      // Verify Google Developer Expert award
      const gdeArticle = page.getByRole('article').filter({ hasText: 'Google Developer Expert' });
      await expect(gdeArticle).toBeVisible();
      await expect(gdeArticle.getByRole('heading', { name: 'Google Developer Expert', level: 3 })).toBeVisible();

      // Verify Microsoft MVP award
      const mvpArticle = page.getByRole('article').filter({ hasText: 'Former Microsoft Most Valuable Professional' });
      await expect(mvpArticle).toBeVisible();
      await expect(mvpArticle.getByRole('heading', { name: 'Former Microsoft Most Valuable Professional', level: 3 })).toBeVisible();
    });
  });

  test('About page - Validates award article count and links', async ({ page }) => {
    await test.step('Count award articles', async () => {
      const articles = page.getByRole('article');
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
      const youtubeLink = page.getByRole('link', { name: /Check out my YouTube Channel/i });
      await expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');
    });

    await test.step('Verify educational platform links', async () => {
      await expect(page.getByRole('link', { name: 'Vue School' })).toHaveAttribute('href', 'https://vueschool.io/courses/internationalization-with-vue-i18n');
      await expect(page.getByRole('link', { name: 'Jamstack Explorers' })).toHaveAttribute('href', 'https://explorers.netlify.com/learn/get-started-with-nuxt');
      await expect(page.getByRole('link', { name: 'Ultimate Courses' })).toHaveAttribute('href', 'https://ultimatecourses.com/author/debbieobrien');
    });
  });
});
