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

      // Click the tag link using accessible locators
      // Find the link with the tag name, ensuring we get the first one from the filter section
      const tagLink = page.getByRole('link', { name: topicMappings[topic] }).first();

      // Retry the click until navigation actually happens. On a cold page load
      // (e.g. a fresh Endform runner) a click can fire before Nuxt hydration
      // attaches the SPA router, silently leaving us on /blog. Re-clicking until
      // the URL updates makes this robust without masking a real failure.
      await expect(async () => {
        await tagLink.click();
        await expect(page).toHaveURL(new RegExp(`/blog/tags/${topic}/?$`), { timeout: 2000 });
      }).toPass({ timeout: 15000 });

      // Check that there are articles with tag links matching the topic
      await expect.poll(() =>
        page.getByRole('article').getByRole('link', { name: `#${topic}` }).count())
        .toBeGreaterThan(0);
    }
    });
}
