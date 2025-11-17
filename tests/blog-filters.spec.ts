import { expect, test } from '@playwright/test';

// Map of test topics to their display names with # prefix and proper capitalization
const topicMappings: Record<string, string> = {
  'nuxt': '#Nuxt',
  'playwright': '#Playwright', 
  'testing': '#testing',
  'react': '#React',
  'personal': '#personal',
  'javascript': '#JavaScript'
};

const topics = Object.keys(topicMappings);

for (const topic of topics) {
    
  test(`tag links to page with posts on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/blog');

      // Use the display name with # prefix to find the link
      const displayName = topicMappings[topic];
      await page.getByRole('link', { name: displayName, exact: true }).click();
      
      // Check that we navigated to the correct URL
      await expect(page).toHaveURL(new RegExp(`/blog/tags/${topic}`));

      // Check that there are articles with tag links matching the topic
      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: `#${topic}` }).count())
        .toBeGreaterThan(0);
    }
    });
}
