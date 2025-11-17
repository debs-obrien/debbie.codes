import { expect, test } from '@playwright/test';

const topics = ['architecture', 'cms', 'conference talk', 'css', 'dev rel', 'hasura', 'imposter syndrome', 'interviews', 'jamstack', 'learning to code', 'live streams', 'nuxt', 'performance', 'playwright', 'react', 'testing', 'vue'];

for (const topic of topics) {
  test(`tag links to page with videos on ${topic}`, async ({ page, isMobile }) => {
    if(!isMobile){
      await page.goto('/videos');

      // Try clicking from the "Browse by Topic" section first, otherwise use tag links from articles
      let topicLink = page.getByRole('link', { name: topic, exact: true }).first();
      
      // For multi-word topics like "conference talk", look for the tag format with dashes
      if (topic.includes(' ')) {
        const tagLink = page.getByRole('link', { name: `#${topic}` }).first();
        if (await tagLink.isVisible()) {
          topicLink = tagLink;
        }
      }
      
      await topicLink.click();
      
      // Check that we navigated to the correct URL instead of checking heading text
      await expect(page).toHaveURL(new RegExp(`/videos/tags/${topic.replace(/\s+/g, '-')}`));

      // Check that articles with this tag exist on the filtered page
      const articleCount = await page.getByRole('article').count();
      expect(articleCount).toBeGreaterThan(0);
      }
  });
}
