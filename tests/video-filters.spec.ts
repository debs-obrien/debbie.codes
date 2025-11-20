import { expect, test } from '@playwright/test';

// All available topics on the videos page - both in top section and individual articles
const availableTopics = ['conference talk', 'playwright', 'nuxt', 'testing', 'interviews', 'ai', 'mcp', 'architecture', 'live streams', 'jamstack', 'performance', 'react', 'vue', 'css', 'typescript', 'dev rel', 'cms', 'hasura', 'imposter syndrome', 'learning to code'];

for (const topic of availableTopics) {
  test(`tag links to page with videos on ${topic}`, async ({ page, isMobile }) => {
    if(!isMobile){
      await page.goto('/videos');
      
      await test.step('Click tag link and verify navigation', async () => {
        const topicLink = page.getByRole('link', { name: `#${topic}` }).first();
        await topicLink.click();
        await expect(page).toHaveURL(new RegExp(`/videos/tags/${topic.replace(/\s+/g, '-')}`));
      });
      
      await test.step('Wait for content to load and verify videos exist', async () => {
        // Wait for the page to stabilize after navigation
        await page.waitForLoadState('networkidle');
        
        // Check if there are any articles/videos on this page
        const articleCount = await page.getByRole('article').count();
        expect(articleCount).toBeGreaterThan(0);
      });
    }
  });
}
