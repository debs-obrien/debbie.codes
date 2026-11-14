import { expect, test } from './fixtures';

test.describe('YouTube poster quality', () => {
  test('in-post embeds use sddefault with hqdefault fallback', async ({ page }) => {
    await page.goto('/blog/offline-ai-study-app-local-models-lfm3');

    const embed = page.locator('lite-youtube').first();
    await expect(embed).toBeVisible();

    const style = await embed.getAttribute('style');
    expect(style).toMatch(/OBerXXfCYVo\/sddefault\.jpg/);
    expect(style).toMatch(/OBerXXfCYVo\/hqdefault\.jpg/);
    expect(style).not.toMatch(/mqdefault/);
  });

  test('/videos cards still use mqdefault', async ({ page }) => {
    await page.goto('/videos');

    const card = page.locator('article lite-youtube').first();
    await expect(card).toBeVisible();

    const style = await card.getAttribute('style');
    expect(style).toMatch(/\/mqdefault\.jpg/);
    expect(style).not.toMatch(/sddefault/);
  });
});
