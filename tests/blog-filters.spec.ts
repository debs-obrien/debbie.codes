import { expect, test } from '@playwright/test';

const topics = ['nuxt', 'playwright', 'testing', 'react', 'personal', 'javascript']

for (const topic of topics) {
    
  test(`tag links to page with posts on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/blog');

      await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
      await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: topic }).count())
        .toBeGreaterThan(0);
    }
    })
}
