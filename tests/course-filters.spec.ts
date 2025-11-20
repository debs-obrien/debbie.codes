import { expect, test } from '@playwright/test';

const topics = ['apollo', 'graphql', 'i18n', 'nuxt', 'react', 'router', 'vue'];

for (const topic of topics) {
  test(`tag links to page with courses on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/courses');

      // Click on the topic tag link directly (they appear within course articles)
      await page.getByRole('link', { name: `#${topic}` }).first().click();
      
      // Check that we navigated to the correct URL instead of checking heading text
      await expect(page).toHaveURL(new RegExp(`/courses/tags/${topic}`));

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: `#${topic}` }).count())
        .toBeGreaterThan(0);
    }
  });
}
