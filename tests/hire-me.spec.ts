import { expect, test } from '@playwright/test';

const hireMeAgentId = 'agent_8801m5yfwzgpf61szvhj0mj0v5fv';

const expectedGithubHrefs = [
  'https://github.com/debs-obrien/learn-agent-skills',
  'https://github.com/debs-obrien/playwright-movies-app',
  'https://github.com/microsoft/playwright-mcp',
  'https://github.com/debs-obrien/playwright-mcp-prompts',
  'https://github.com/debs-obrien/mcp-weather-server-demo',
  'https://github.com/debs-obrien/debbie.codes'
];

// PoC voice widget on /hire-me; abort so networkidle stays reliable (same as #667).
async function blockElevenLabs(page: import('@playwright/test').Page) {
  await page.route(/unpkg\.com|elevenlabs\.io|api\.elevenlabs/, route => route.abort());
}

const companyNamesInQuestions = [
  'Amazon',
  'AWS',
  'Microsoft',
  'Block',
  'Zephyr',
  'goose'
];

const pageWideBanned = [
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

    const experience = page.getByTestId('hire-me-experience');
    await expect(experience.getByRole('heading', { name: 'Experience', level: 2 })).toBeVisible();
    await expect(experience.getByText(/Independent Developer Educator since Oct 2026/)).toBeVisible();
    await expect(experience.getByText(/Zephyr from Apr 2026 to Sep 2026/)).toBeVisible();
    await expect(experience.getByText(/Block in Feb 2026/)).toBeVisible();
    await expect(experience.getByText(/Microsoft from May 2022 to Dec 2025/)).toBeVisible();
    await expect(experience.getByText(/Head of Developer Advocacy at Bit in 2021/)).toBeVisible();
    await expect(experience.getByText(/Developer Advocate at Nuxt from 2020 to 2021/)).toBeVisible();
    await expect(experience.getByText(/tech lead, consultant and educator from 2008 to 2020/)).toBeVisible();
    await expect(experience.locator('li')).toHaveCount(7);

    await expect(page.getByRole('heading', { name: 'Questions recruiters ask me', level: 2 })).toBeVisible();
    await expect(page.getByText('Tell me about yourself')).toBeVisible();
    await expect(page.getByText('What is your quality bar for content?')).toHaveCount(0);

    const assistant = page.locator('section[aria-labelledby="hire-me-assistant-heading"]');
    await expect(page.getByRole('heading', { name: 'Ask about Debbie', level: 2 })).toBeVisible();
    await expect(assistant.getByText(/answers recruiter questions about my work, numbers and the roles/i)).toBeVisible();
    await expect(assistant.getByText('Try asking:')).toBeVisible();
    await expect(assistant.getByText('What has Debbie done with Playwright and MCP?')).toBeVisible();
    await expect(assistant.getByText('What roles is she looking for?')).toBeVisible();
    await expect(assistant.getByText('What results has she had with developer content?')).toBeVisible();

    const widget = page.locator('elevenlabs-convai');
    await expect(widget).toHaveAttribute('agent-id', hireMeAgentId);

    await expect(page.getByRole('banner').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('footer').getByRole('link', { name: /hire me/i })).toHaveCount(0);
    await expect(page.locator('a[href="/hire-me"], a[href="/hire-me/"]')).toHaveCount(0);

    const projects = page.locator('section[aria-labelledby="projects-heading"]');
    await expect(projects.getByRole('link', { name: 'learn-agent-skills' })).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/learn-agent-skills'
    );
    await expect(projects.getByRole('link', { name: 'playwright-movies-app' })).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/playwright-movies-app'
    );
    await expect(projects.getByRole('link', { name: '(live demo)' })).toHaveAttribute(
      'href',
      'https://debs-obrien.github.io/playwright-movies-app/'
    );
    await expect(projects.getByRole('link', { name: 'playwright-mcp-prompts' })).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/playwright-mcp-prompts'
    );
    await expect(projects.getByRole('link', { name: 'mcp-weather-server-demo' })).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/mcp-weather-server-demo'
    );
    await expect(
      projects.getByRole('link', { name: 'This site, built with Nuxt and Nuxt Content, is open source' })
    ).toHaveAttribute('href', 'https://github.com/debs-obrien/debbie.codes');

    const githubHrefs = await page.locator('main a[href^="https://github.com/"]').evaluateAll(anchors =>
      [...new Set(anchors.map(a => (a as HTMLAnchorElement).href))].sort()
    );
    expect(githubHrefs).toEqual([...expectedGithubHrefs].sort());

    for (const href of expectedGithubHrefs) {
      await expect(page.locator(`main a[href="${href}"]`).first()).toHaveAttribute('href', href);
      const linkRes = await request.get(href);
      expect(linkRes.status(), `expected 200 for ${href}`).toBe(200);
    }

    await expect(page.locator('main a[href="https://www.youtube.com/watch?v=IixdI2bTR1g"]').first()).toHaveText('180K');
    await expect(page.locator('main a[href="https://www.youtube.com/watch?v=AaCj939XIQ4"]').first()).toHaveText('140K');
    await expect(
      page.locator('main a[href="https://www.youtube.com/watch?v=erqdtkd1GNg"]').first()
    ).toHaveText('A live MCP workshop I co-taught in Spanish');

    // Open Q&A answers so company-name ban covers answer copy via innerText.
    for (const details of await page.getByTestId('hire-me-questions').locator('details').all())
      await details.evaluate(el => el.setAttribute('open', ''));

    const questionsText = await page.getByTestId('hire-me-questions').evaluate((el) => {
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- scoped leak guard must use visible text
      return (el as HTMLElement).innerText;
    });
    for (const term of companyNamesInQuestions) {
      expect(questionsText, `questions section must not contain "${term}"`).not.toMatch(
        new RegExp(`\\b${term}\\b`, 'i')
      );
    }

    const pageText = await page.evaluate(() => {
      // eslint-disable-next-line unicorn/prefer-dom-node-text-content -- page-wide ban must use visible text
      return document.body.innerText;
    });
    for (const term of pageWideBanned) {
      expect(pageText, `page must not contain "${term}"`).not.toMatch(
        new RegExp(`\\b${term}\\b`, 'i')
      );
    }

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    const sitemapXml = await sitemap.text();
    expect(sitemapXml).not.toContain('/hire-me');
  });
});
