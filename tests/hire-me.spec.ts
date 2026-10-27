import { expect, test } from '@playwright/test';

// PoC voice widget on /hire-me; abort so networkidle stays reliable (same as #667).
async function blockElevenLabs(page: import('@playwright/test').Page) {
  await page.route(/unpkg\.com|elevenlabs\.io|api\.elevenlabs/, route => route.abort());
}

const forbiddenTerms = [
  'Amazon',
  'AWS',
  'Microsoft',
  'Block',
  'Zephyr',
  'goose',
  'ElevenLabs',
  'salary'
];

test.describe('Hire me page (PoC, preview only)', () => {
  test('is reachable, noindex, undiscoverable, and keeps private names out', async ({ page, request }) => {
    await blockElevenLabs(page);

    const res = await page.goto('/hire-me');
    expect(res?.status()).toBe(200);

    await expect(page.getByRole('heading', { name: 'Hire me', level: 1 })).toBeVisible();

    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /noindex/);
    await expect(robots).toHaveAttribute('content', /nofollow/);

    await expect(page.getByRole('heading', { name: 'Numbers at a glance', level: 2 })).toBeVisible();
    await expect(page.locator('section[aria-labelledby="numbers-heading"] li').first()).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Questions recruiters ask me', level: 2 })).toBeVisible();
    await expect(page.getByText('Tell me about yourself')).toBeVisible();

    await expect(page.getByRole('banner').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('footer').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('a[href="/hire-me"], a[href="/hire-me/"]')).toHaveCount(0);

    const bodyText = await page.locator('body').textContent();
    for (const term of forbiddenTerms) {
      expect(bodyText, `rendered page must not contain "${term}"`).not.toMatch(
        new RegExp(`\\b${term}\\b`, 'i')
      );
    }

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapXml = await sitemap.text();
    expect(sitemapXml).not.toContain('/hire-me');
  });
});
