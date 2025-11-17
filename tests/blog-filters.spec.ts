import { expect, test } from '@playwright/test';

// Map of test topics to their display names with # prefix and proper capitalization
// Only include tags that are actually displayed in the filter section
const topicMappings: Record<string, string> = {
  'nuxt': '#Nuxt',
  'playwright': '#Playwright', 
  'testing': '#testing',
  'react': '#React',
  'personal': '#personal',
  'ai': '#AI'  // Using 'ai' instead of 'javascript' since it's visible in the filter
};

const topics = Object.keys(topicMappings);

for (const topic of topics) {
    
  test(`tag links to page with posts on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/blog');

      // Wait for the page to be fully loaded
      await page.waitForLoadState('networkidle');
      
      // Click the tag link in the filter section using a more direct approach
      // Target the container that holds the filter tags and click the first occurrence of the tag
      await page.evaluate((targetTopic) => {
        // Find the main element and get the third child div which contains the tag filters
        const main = document.querySelector('main');
        if (main && main.children[2]) {
          const tagContainer = main.children[2];
          const tagLink = tagContainer.querySelector(`a[href="/blog/tags/${targetTopic}"]`);
          if (tagLink) {
            tagLink.click();
          } else {
            throw new Error(`Tag link for ${targetTopic} not found in filter section`);
          }
        } else {
          throw new Error('Main element or tag container not found');
        }
      }, topic);
      
      // Check that we navigated to the correct URL
      await expect(page).toHaveURL(new RegExp(`/blog/tags/${topic}`));

      // Check that there are articles with tag links matching the topic
      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: `#${topic}` }).count())
        .toBeGreaterThan(0);
    }
    });
}
