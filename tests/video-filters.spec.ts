import { expect, test } from '@playwright/test';

// Slugs as stored in content frontmatter / tag URLs. TagChip renders these with
// replaceHyphen() as `#conference talk`, `#learning to code`, etc. Select by
// href (stable slug) so hyphen-vs-space display formatting cannot desync the
// locator from the rendered accessible name.
const availableTopics = [
  'conference-talk',
  'playwright',
  'nuxt',
  'testing',
  'interviews',
  'ai',
  'mcp',
  'architecture',
  'live-streams',
  'jamstack',
  'performance',
  'react',
  'vue',
  'css',
  'typescript',
  'dev-rel',
  'cms',
  'hasura',
  'imposter-syndrome',
  'learning-to-code',
];

function tagLabel(slug: string) {
  return `#${slug.replaceAll('-', ' ')}`;
}

for (const topic of availableTopics) {
  test(`tag links to page with videos on ${topic}`, async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.goto('/videos');

      await test.step('Click tag link and verify navigation', async () => {
        // Prefer the chip-row / first matching tag URL; assert the accessible
        // name still matches replaceHyphen display (`#learning to code`).
        const topicLink = page.locator(`a[href="/videos/tags/${topic}"]`).first();
        await expect(topicLink).toBeVisible();
        await expect(topicLink).toHaveAccessibleName(tagLabel(topic));
        await topicLink.click();
        await expect(page).toHaveURL(new RegExp(`/videos/tags/${topic}`));
      });

      await test.step('Wait for content to load and verify videos exist', async () => {
        // Wait for the page to stabilize after navigation
        await page.waitForLoadState('networkidle');

        // Check if there are any articles/videos on this page. Poll rather than
        // a one-shot count(): on a cold load articles hydrate progressively.
        await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
      });
    }
  });
}
