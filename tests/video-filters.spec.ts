import { expect, test } from '@playwright/test';

const topics = ['architecture', 'cms', 'conference talk', 'css', 'dev rel', 'hasura', 'imposter syndrome', 'interviews', 'jamstack', 'learning to code', 'live streams', 'nuxt', 'performance', 'playwright', 'react', 'testing', 'vue'];

for (const topic of topics) {
  test(`tag links to page with videos on ${topic}`, async ({ page, isMobile }) => {
    if(!isMobile){
      await page.goto('/videos');

      await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
      
      // Check that we navigated to the correct URL instead of checking heading text
      await expect(page).toHaveURL(new RegExp(`/videos/tags/${topic.replace(' ', '-')}`));

      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: topic }).count())
          .toBeGreaterThan(0);
      }
  });
}
