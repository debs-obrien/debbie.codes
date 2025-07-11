import { test, expect } from '@playwright/test';

test.describe('Homepage Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('https://debbie.codes');
  });

  test('Homepage - displays main content and navigation correctly', async ({ page }) => {
    await test.step('Verify main heading and professional info', async () => {
      await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible();
      await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();
    });

    await test.step('Verify accessibility tree structure', async () => {
      // The page doesn't have a main element, so we'll check the overall structure
      await expect(page.locator('body')).toMatchAriaSnapshot(`
        - heading "Debbie O'Brien" [level=1]
        - paragraph
        - paragraph
        - paragraph
        - region "Recent Videos":
          - link "Recent Videos":
            - /url: /videos
          - list
        - heading "Featured Posts" [level=2]
        - article
        - article
        - heading "Featured Podcast" [level=2]
        - article "Featured Podcast"
        - region "Recent Blog Posts":
          - link "Recent Blog Posts":
            - /url: /blog
          - list
        - region "Recent Podcasts":
          - link "Recent Podcasts":
            - /url: /podcasts
          - list
      `);
    });

    await test.step('Verify navigation structure', async () => {
      const navigation = page.getByRole('navigation');
      await expect(navigation.getByRole('link', { name: 'About' })).toBeVisible();
      await expect(navigation.getByRole('link', { name: 'Videos' })).toBeVisible();
      await expect(navigation.getByRole('link', { name: 'Podcasts' })).toBeVisible();
      await expect(navigation.getByRole('link', { name: 'Courses' })).toBeVisible();
      await expect(navigation.getByRole('link', { name: 'Blog' })).toBeVisible();
    });
  });

  test('Homepage - navigation links work correctly', async ({ page }) => {
    await test.step('Navigate to Blog section', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
      await expect(page).toHaveURL('https://debbie.codes/blog');
      await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
    });

    await test.step('Navigate to Videos section', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Videos' }).click();
      await expect(page).toHaveURL('https://debbie.codes/videos');
      await expect(page.getByRole('heading', { name: 'Videos', level: 1 })).toBeVisible();
    });

    await test.step('Navigate to Podcasts section', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Podcasts' }).click();
      await expect(page).toHaveURL('https://debbie.codes/podcasts');
      await expect(page.getByRole('heading', { name: 'Podcast Interviews', level: 1 })).toBeVisible();
    });
  });

  test('Homepage - featured content sections are visible', async ({ page }) => {
    await test.step('Verify Recent Videos section', async () => {
      const videosSection = page.getByRole('region', { name: 'Recent Videos' });
      await expect(videosSection).toBeVisible();
      await expect(videosSection.getByRole('heading', { name: 'Recent Videos', level: 2 })).toBeVisible();
      // Use a more specific locator to avoid strict mode violation
      const videosList = videosSection.getByRole('list').nth(0);
      await expect(videosList).toBeVisible();
      // Verify it contains video items (only direct articles)
      const videoArticles = videosList.locator('article');
      await expect(videoArticles).toHaveCount(4);

      await test.step('Verify Featured Podcast section', async () => {
        const podcastSection = page.getByRole('article', { name: 'Featured Podcast' });
        await expect(podcastSection).toBeVisible();
        await expect(podcastSection.getByRole('heading', { name: 'Featured Podcast', level: 3 })).toBeVisible();
        await expect(podcastSection.getByRole('link', { name: 'Listen Now' })).toBeVisible();
      });
    });
  });

  test('Homepage - social media links are accessible', async ({ page }) => {
    await test.step('Verify social media links in header', async () => {
      await expect(page.getByRole('banner').getByRole('link', { name: 'x' })).toHaveAttribute('href', 'https://x.com/debs_obrien');
      await expect(page.getByRole('banner').getByRole('link', { name: 'linkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/debbie-o-brien-1a199975/');
      await expect(page.getByRole('banner').getByRole('link', { name: 'github' })).toHaveAttribute('href', 'https://github.com/debs-obrien');
      await expect(page.getByRole('banner').getByRole('link', { name: 'youtube' })).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');
    });
  });
});
