import { expect, test } from '@playwright/test';

// Topics available in the "Browse by Topic" section
const browseTopics = ['nuxt', 'playwright', 'testing', 'vue', 'javascript', 'react', 'performance', 'accessibility'];

// Topics that appear as tags in articles
const tagTopics = ['architecture', 'cms', 'conference talk', 'css', 'dev rel', 'hasura', 'imposter syndrome', 'interviews', 'jamstack', 'learning to code', 'live streams'];

const allTopics = [...browseTopics, ...tagTopics];

for (const topic of allTopics) {
  test(`tag links to page with videos on ${topic}`, async ({ page, isMobile }) => {
    if(!isMobile){
      await page.goto('/videos');

      let topicLink;
      
      // If it's a browse topic, click from the Browse by Topic section
      if (browseTopics.includes(topic)) {
        topicLink = page.getByRole('link', { name: topic, exact: true });
      } else {
        // For tag topics, click the tag link from articles (with # prefix)
        topicLink = page.getByRole('link', { name: `#${topic}` }).first();
      }
      
      await topicLink.click();
      
      // Check that we navigated to the correct URL
      await expect(page).toHaveURL(new RegExp(`/videos/tags/${topic.replace(/\s+/g, '-')}`));

      // Check that articles with this tag exist on the filtered page
      const articleCount = await page.getByRole('article').count();
      expect(articleCount).toBeGreaterThan(0);
      }
  });
}
