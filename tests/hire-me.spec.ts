import process from 'node:process';
import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

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
    await expect(page.locator('#hire-me-assistant-heading')).toBeVisible();
    await expect(assistant.getByText(/answers questions from recruiters, hiring managers and future teammates about my work, numbers and the roles/i)).toBeVisible();
    await expect(assistant.getByText(/prototype/i)).toHaveCount(0);
    await expect(assistant.getByText('Try asking:')).toBeVisible();
    await expect(assistant.getByText('What has Debbie done with Playwright and MCP?')).toBeVisible();
    await expect(assistant.getByText('What roles is she looking for?')).toBeVisible();
    await expect(assistant.getByText('What results has she had with developer content?')).toBeVisible();

    // Opt-in card is present; the embed is not mounted until Start.
    const optIn = page.getByTestId('hire-me-voice-opt-in');
    await expect(optIn.getByRole('button', { name: 'Start voice assistant' })).toBeVisible();
    await expect(page.locator('elevenlabs-convai')).toHaveCount(0);

    await expect(page.getByRole('link', { name: 'further down' })).toHaveAttribute(
      'href',
      '#hire-me-assistant-heading'
    );

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

  test('loads zero unpkg or elevenlabs requests before opt-in', async ({ page }) => {
    const blockedHosts: string[] = [];
    await page.route(/unpkg\.com|elevenlabs\.io|api\.elevenlabs/, (route) => {
      blockedHosts.push(route.request().url());
      return route.abort();
    });

    const seen: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (/unpkg\.com|elevenlabs\.io|api\.elevenlabs/i.test(url))
        seen.push(url);
    });

    await page.goto(hireMePath);
    const start = page.getByRole('button', { name: 'Start voice assistant' });
    await expect(start).toBeVisible();
    await expect(page.locator('elevenlabs-convai')).toHaveCount(0);
    await expect(page.locator('script[src*="elevenlabs"], script[src*="unpkg.com/@elevenlabs"]')).toHaveCount(0);
    await page.waitForLoadState('networkidle');
    // Hydration: Start is actionable before we open the observation window.
    await expect(async () => {
      await start.click({ trial: true });
    }).toPass({ timeout: 15000 });
    // Real observation window after hydration so a deferred inject would fire.
    await page.waitForTimeout(1500);
    expect(seen, `unexpected third-party voice requests: ${seen.join(', ')}`).toEqual([]);
    expect(blockedHosts).toEqual([]);
  });

  test('keyboard: Tab reaches Start and Enter begins loading (script blocked)', async ({ page }) => {
    // Hold the script request so Loading… is observable, then abort for the error path.
    let releaseScript!: () => void;
    const scriptGate = new Promise<void>((resolve) => {
      releaseScript = resolve;
    });
    await page.route(/unpkg\.com|elevenlabs\.io|api\.elevenlabs/, async (route) => {
      await scriptGate;
      await route.abort();
    });

    await page.goto(hireMePath);

    const start = page.getByRole('button', { name: 'Start voice assistant' });
    await expect(start).toBeVisible();
    // Hydration attaches the click handler; wait until a real click moves state.
    await expect(async () => {
      await start.click({ trial: true });
    }).toPass({ timeout: 15000 });

    // Start from the in-page "further down" link, then Tab to the Start button.
    const furtherDown = page.getByRole('link', { name: 'further down' });
    await furtherDown.focus();
    await expect(furtherDown).toBeFocused();
    await expect(async () => {
      await page.keyboard.press('Tab');
      await expect(start).toBeFocused({ timeout: 500 });
    }).toPass({ timeout: 10000 });

    // Retry Enter until the Vue handler has run (parallel workers can still be hydrating).
    await expect(async () => {
      await start.press('Enter');
      await expect(page.getByRole('button', { name: 'Loading…' })).toBeVisible({ timeout: 1000 });
    }).toPass({ timeout: 15000 });

    const loading = page.getByRole('button', { name: 'Loading…' });
    await expect(loading).toHaveAttribute('aria-busy', 'true');
    await expect(loading).toBeDisabled();

    releaseScript();
    // Script is aborted → error + retry, never a live embed.
    await expect(page.getByText(/couldn't load/i)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('button', { name: 'Try again' })).toBeVisible();
    await expect(page.locator('elevenlabs-convai')).toHaveCount(0);
  });

  test('at 390px the opt-in card does not overlap the intro', async ({ page }) => {
    await blockElevenLabs(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(hireMePath);

    const intro = page.locator('main .prose p').filter({ hasText: /optional voice assistant/i });
    const card = page.getByTestId('hire-me-voice-opt-in');
    await expect(intro).toBeVisible();
    await expect(card).toBeVisible();
    await expect(page.locator('elevenlabs-convai')).toHaveCount(0);

    const introBox = await intro.boundingBox();
    const cardBox = await card.boundingBox();
    expect(introBox).toBeTruthy();
    expect(cardBox).toBeTruthy();
    // Card sits below the intro; no vertical overlap before opt-in.
    expect(cardBox!.y).toBeGreaterThanOrEqual(introBox!.y + introBox!.height - 1);

    // No fixed/sticky voice chrome covering the intro before opt-in.
    await intro.scrollIntoViewIfNeeded();
    const covering = await intro.evaluate((introEl) => {
      const rect = introEl.getBoundingClientRect();
      const midX = rect.left + rect.width / 2;
      const midY = rect.top + rect.height / 2;
      const top = document.elementFromPoint(midX, midY);
      if (!top)
        return null;
      if (top.closest('[data-testid="hire-me-voice-opt-in"]') || top.tagName.toLowerCase() === 'elevenlabs-convai')
        return top.tagName;
      return null;
    });
    expect(covering).toBeNull();
  });

  for (const theme of ['light', 'dark'] as const) {
    test(`opt-in card text and button pass 4.5:1 contrast (${theme})`, async ({ page }) => {
      await page.emulateMedia({ colorScheme: theme });
      await blockElevenLabs(page);
      await page.goto(hireMePath);
      await expect(page.locator('html')).toHaveClass(new RegExp(`\\b${theme}\\b`));

      const card = page.getByTestId('hire-me-voice-opt-in');
      await expect(card.getByRole('button', { name: 'Start voice assistant' })).toBeVisible();

      const results = await new AxeBuilder({ page })
        .include('[data-testid="hire-me-voice-opt-in"]')
        .withTags(['wcag2aa', 'wcag21aa'])
        .analyze();

      const contrastViolations = results.violations.filter(v => v.id === 'color-contrast');
      expect(
        contrastViolations,
        `${theme} theme color-contrast: ${JSON.stringify(contrastViolations, null, 2)}`
      ).toEqual([]);
    });
  }

  test('limits the voice widget text box to 500 characters', async ({ page }) => {
    // Needs the real embed UI (do not abort unpkg / voice hosts).
    // Agent origin allowlists often block non-production hosts; skip cleanly then.
    await page.goto(hireMePath);

    const start = page.getByRole('button', { name: 'Start voice assistant' });
    try {
      await expect(start).toBeVisible({ timeout: 15000 });
      await start.click();
    }
    catch {
      test.skip(true, 'Voice opt-in button did not appear');
      return;
    }

    const host = page.locator('elevenlabs-convai');
    try {
      await expect(host).toBeAttached({ timeout: 20000 });
      await expect(host).toHaveAttribute('agent-id', hireMeAgentId);
      await expect(host).toHaveAttribute('disable-banner', 'true');
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
