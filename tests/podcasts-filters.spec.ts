import { expect, test } from '@playwright/test';

const topics = ['bit', 'dev rel', 'jamstack', 'mentoring', 'nuxt', 'playwright', 'react', 'testing']


test(`tag links to page with podcasts on a topic`, async ({ page, isMobile }) => {
  for (const topic of topics) {
    if (!isMobile) {
      await page.goto('/podcasts');

      await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();

      await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: topic }).count())
        .toBeGreaterThan(0);
    }  
  }
})
