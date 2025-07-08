import { expect, test } from '@playwright/test';

const topics = ['bit', 'dev rel', 'jamstack', 'mentoring', 'nuxt', 'playwright', 'react', 'testing'];

for (const topic of topics) {
  test(`tag links to page with podcasts on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/podcasts');

      await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();

      await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: topic }).count())
        .toBeGreaterThan(0);
    }
    });
}
