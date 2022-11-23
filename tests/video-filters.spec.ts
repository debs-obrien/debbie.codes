import { expect, test } from '@playwright/test';

const topics = ['architecture', 'cms', 'conference talk', 'css', 'dev rel', 'hasura', 'imposter syndrome', 'interviews', 'jamstack', 'learning to code', 'live streams', 'nuxt', 'performance', 'playwright', 'react', 'testing', 'vue']

for (const topic of topics) {
  test(`tag links to page with videos on ${topic}`, async ({ page }) => {
    await page.goto('/videos');
    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);
    await expect.poll(() =>
      page.getByRole('article').getByRole('link', { name: topic }).count())
      .toBeGreaterThan(0);
  })
}
