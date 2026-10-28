import process from 'node:process';
import { expect, test } from '@playwright/test';

const hireMeAgentId = 'agent_8801m5yfwzgpf61szvhj0mj0v5fv';

// @nuxtjs/robots blocks indexing in local/dev; mock production so we assert
// the page itself is indexable (deploy previews already run as production).
const externalBaseURL = (process.env.PLAYWRIGHT_TEST_BASE_URL || process.env.BASE_URL)?.trim();
const hireMePath = externalBaseURL ? '/hire-me' : '/hire-me?mockProductionEnv';

const expectedGithubHrefs = [
  'https://github.com/debs-obrien/learn-agent-skills',
  'https://github.com/debs-obrien/playwright-movies-app',
  'https://github.com/microsoft/playwright-mcp',
  'https://github.com/debs-obrien/playwright-mcp-prompts',
  'https://github.com/debs-obrien/mcp-weather-server-demo',
  'https://github.com/debs-obrien/debbie.codes'
];

// Voice widget on /hire-me; abort so networkidle stays reliable (same as #667).
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

test.describe('Hire me page', () => {
  test('is reachable, indexable, linked from nav, in sitemap, and keeps private names out', async ({ page, request }) => {
    await blockElevenLabs(page);

    const res = await page.goto(hireMePath);
    expect(res?.status()).toBe(200);

    await expect(page.getByRole('heading', { name: 'Hire me', level: 1 })).toBeVisible();

    const robots = page.locator('meta[name="robots"]');
    await expect(robots).toHaveAttribute('content', /index/i);
    await expect(robots).not.toHaveAttribute('content', /noindex/i);
    await expect(robots).not.toHaveAttribute('content', /nofollow/i);

    // Netlify deploy previews always send X-Robots-Tag: noindex for every
    // path. Assert the header only outside those previews (local mock /
    // production), where it reflects app/route config.
    const isNetlifyDeployPreview = /deploy-preview|--.*\.netlify\.app/i.test(externalBaseURL || '');
    if (!isNetlifyDeployPreview) {
      const headerRes = await request.get(hireMePath);
      const xRobots = headerRes.headers()['x-robots-tag'] ?? '';
      expect(xRobots, 'x-robots-tag must not noindex /hire-me').not.toMatch(/noindex/i);
    }

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

    await expect(page.getByRole('heading', { name: 'Questions from recruiters, hiring managers and future teammates', level: 2 })).toBeVisible();
    await expect(page.getByText('Tell me about yourself')).toBeVisible();
    await expect(page.getByText('What is your quality bar for content?')).toHaveCount(0);

    const assistant = page.locator('section[aria-labelledby="hire-me-assistant-heading"]');
    await expect(page.getByRole('heading', { name: 'Ask about Debbie', level: 2 })).toBeVisible();
    await expect(assistant.getByText(/answers questions from recruiters, hiring managers and future teammates about my work, numbers and the roles/i)).toBeVisible();
    await expect(assistant.getByText(/prototype/i)).toHaveCount(0);
    await expect(assistant.getByText('Try asking:')).toBeVisible();
    await expect(assistant.getByText('What has Debbie done with Playwright and MCP?')).toBeVisible();
    await expect(assistant.getByText('What roles is she looking for?')).toBeVisible();
    await expect(assistant.getByText('What results has she had with developer content?')).toBeVisible();

    const widget = page.locator('elevenlabs-convai');
    await expect(widget).toHaveAttribute('agent-id', hireMeAgentId);

    // Desktop nav: Hire me is visible and goes to /hire-me
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto('/');
    const desktopHireMe = page.getByRole('navigation').getByRole('link', { name: 'Hire me' });
    await expect(desktopHireMe).toBeVisible();
    await desktopHireMe.click();
    await expect(page).toHaveURL(/\/hire-me\/?$/);

    // Mobile dialog nav: Hire me is visible and goes to /hire-me
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    const openMenu = page.getByRole('button', { name: 'Open menu' });
    const mobileMenu = page.getByRole('dialog', { name: 'Menu' });
    // Open handler attaches on hydration; retry until the dialog is open.
    await expect(async () => {
      if (!(await mobileMenu.isVisible().catch(() => false))) {
        await openMenu.click();
      }
      await expect(mobileMenu).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
    const mobileHireMe = mobileMenu.getByRole('navigation').getByRole('link', { name: 'Hire me' });
    await expect(mobileHireMe).toBeVisible();
    await mobileHireMe.click();
    await expect(page).toHaveURL(/\/hire-me\/?$/);

    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(hireMePath);

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
    expect(sitemapXml).toContain('/hire-me');
  });

  test('limits the voice widget text box to 500 characters', async ({ page }) => {
    // Needs the real embed UI (do not abort unpkg / voice hosts).
    // Agent origin allowlists often block non-production hosts; skip cleanly then.
    await page.goto(hireMePath);

    const host = page.locator('elevenlabs-convai');
    try {
      await expect(host).toBeAttached({ timeout: 15000 });
      await expect(host.locator('button[aria-label="Message"]')).toBeVisible({ timeout: 20000 });
    }
    catch {
      test.skip(true, 'Voice widget did not load (embed blocked or origin not allowlisted for this host)');
      return;
    }

    await host.locator('button[aria-label="Message"]').click();

    const textbox = host.locator('textarea[placeholder="Send a message..."]');
    try {
      await expect(textbox).toBeVisible({ timeout: 10000 });
    }
    catch {
      test.skip(true, 'Voice widget text box did not open (embed blocked or origin not allowlisted for this host)');
      return;
    }

    await textbox.fill('x'.repeat(600));
    expect((await textbox.inputValue()).length).toBe(500);
  });
});
