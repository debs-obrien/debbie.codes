import { expect, test } from '@playwright/test';

// Curated /videos filter chips (designer lock). Agents → `ai`; Grok Bot → `grok-bot`.
const curatedChips = [
  { label: 'All', href: '/videos', expectUrl: /\/videos\/?$/ },
  { label: 'Playwright', href: '/videos/tags/playwright', expectUrl: /\/videos\/tags\/playwright/ },
  { label: 'MCP', href: '/videos/tags/mcp', expectUrl: /\/videos\/tags\/mcp/ },
  { label: 'Agents', href: '/videos/tags/ai', expectUrl: /\/videos\/tags\/ai/ },
  { label: 'Nuxt', href: '/videos/tags/nuxt', expectUrl: /\/videos\/tags\/nuxt/ },
  { label: 'Grok Bot', href: '/videos/tags/grok-bot', expectUrl: /\/videos\/tags\/grok-bot/ },
];

test.describe('Videos filter chips', () => {
  for (const chip of curatedChips) {
    test(`chip "${chip.label}" links correctly`, async ({ page, isMobile }) => {
      if (isMobile)
        return;

      await page.goto('/videos');

      await test.step('Click chip and verify navigation', async () => {
        const chipLink = page.locator(`a[href="${chip.href}"]`).first();
        await expect(chipLink).toHaveAccessibleName(chip.label);
        await chipLink.click();
        await expect(page).toHaveURL(chip.expectUrl);
      });

      if (chip.label === 'All')
        return;

      await test.step('Wait for content to load and verify videos exist', async () => {
        await page.waitForLoadState('networkidle');
        await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
      });
    });
  }
});
