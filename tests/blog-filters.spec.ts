import { expect, test } from '@playwright/test';

const topics = ['architecture', 'dev rel', 'jamstack', 'javascript', 'lifestyle', 'mentoring', 'motivation', 'nuxt', 'performance', 'playwright', 'react', 'testing', 'typescript', 'vs code', 'vue']

test.fixme();

for (const topic of topics) {
    
  test(`tag links to page with posts on ${topic}`, async ({ page }) => {
    await page.goto('/blog');


    await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
    await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

    await expect.poll(() =>
      page.getByRole('article').getByRole('link', { name: topic }).count())
      .toBeGreaterThan(0);
  })
}
