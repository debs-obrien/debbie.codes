import { expect, test } from '@playwright/test';

const hireMeAgentId = 'agent_8801m5yfwzgpf61szvhj0mj0v5fv';

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
    await expect(page.getByText('What is your quality bar for content?')).toHaveCount(0);

    const assistant = page.locator('section[aria-labelledby="hire-me-assistant-heading"]');
    await expect(page.getByRole('heading', { name: 'Ask about Debbie (prototype)', level: 2 })).toBeVisible();
    await expect(assistant.getByText(/answers recruiter questions about my work, numbers and the roles/i)).toBeVisible();
    await expect(assistant.getByText('Try asking:')).toBeVisible();
    await expect(assistant.getByText('What has Debbie done with Playwright and MCP?')).toBeVisible();
    await expect(assistant.getByText('What roles is she looking for?')).toBeVisible();
    await expect(assistant.getByText('What results has she had with developer content?')).toBeVisible();

    const widget = page.locator('elevenlabs-convai');
    await expect(widget).toHaveAttribute('agent-id', hireMeAgentId);
    await expect(widget).toHaveAttribute(
      'action-text',
      'Questions about hiring Debbie? Talk to her AI assistant'
    );
    await expect(widget).toHaveAttribute('start-call-text', 'Start voice call');
    await expect(widget).toHaveAttribute('end-call-text', 'End call');

    await expect(page.getByRole('banner').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('footer').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('a[href="/hire-me"], a[href="/hire-me/"]')).toHaveCount(0);

    // Visible page text only — not script URLs or custom-element tag names.
    const visibleText = await page.evaluate(() => {
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- leak guard must use visible text, not textContent
      return document.body.innerText;
    });
    for (const term of forbiddenTerms) {
      expect(visibleText, `visible page text must not contain "${term}"`).not.toMatch(
        new RegExp(`\\b${term}\\b`, 'i')
      );
    }

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapXml = await sitemap.text();
    expect(sitemapXml).not.toContain('/hire-me');
  });
});
