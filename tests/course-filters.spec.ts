import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page, isMobile }) => {
  await page.goto('/courses');
})

const topics = ['apollo', 'graphql', 'i18n', 'nuxt', 'react', 'router', 'vue']

test(`tag links to page with courses on a topic`, async ({ page, isMobile }) => {
  for (const topic of topics) {
    if (!isMobile) {

      await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
      await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: topic }).count())
        .toBeGreaterThan(0);
    }
  }
})
