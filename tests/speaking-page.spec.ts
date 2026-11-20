import { expect, test } from './fixtures';

test.describe('Speaking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/speaking');
  });

  test('shows empty upcoming and 2026 past talks from decks', async ({ page }) => {
    await expect(page).toHaveTitle(/Speaking/);
    await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();
    await expect(page.getByText(/I speak about Playwright/i)).toBeVisible();
    await expect(page.getByText(/workshop/i)).toHaveCount(0);
    await expect(page.getByText(/already take/i)).toHaveCount(0);

    await expect(page.getByRole('heading', { name: 'Upcoming', level: 2 })).toBeVisible();
    await expect(
      page.getByText('No upcoming talks listed right now. Past talks and decks are below.')
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: '2026 talks', level: 2 })).toBeVisible();

    const endform = page.locator('li').filter({ has: page.getByText('Endform', { exact: true }) });
    await expect(
      endform.getByRole('heading', {
        name: 'Bug Report In, Pull Request Out: Agentic CI with Playwright',
        level: 3
      })
    ).toBeVisible();
    await expect(endform.getByText('12 Nov 2026 · Online', { exact: true })).toBeVisible();

    const infobip = page.locator('li').filter({
      has: page.getByText('Infobip Shift 2026', { exact: true })
    });
    await expect(
      infobip.getByRole('heading', {
        name: 'The Agentic Developer: Orchestrating AI Workflows With Skills and MCPs',
        level: 3
      })
    ).toBeVisible();
    await expect(infobip.getByText('Tue 15 Sep 2026 · Zadar', { exact: true })).toBeVisible();

    const zurich = page.locator('li').filter({
      has: page.getByText('ZurichJS Conf 2026', { exact: true })
    });
    await expect(
      zurich.getByRole('heading', {
        name: 'Bug Report In, Pull Request Out: Agentic CI with Playwright',
        level: 3
      })
    ).toBeVisible();
    await expect(zurich.getByText('Fri 11 Sep 2026', { exact: true })).toBeVisible();

    const devsum = page.locator('li').filter({
      has: page.getByText('DevSum 2026', { exact: true })
    });
    await expect(
      devsum.getByRole('heading', {
        name: 'The Agentic Developer: Orchestrating AI Workflows with MCPs',
        level: 3
      })
    ).toBeVisible();
    await expect(devsum.getByText('June 2026 · Stockholm', { exact: true })).toBeVisible();

    const endformDeck = page.getByRole('link', { name: 'Endform slide deck on GitHub' });
    await expect(endformDeck).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/endform-2026-bug-report-pr-out'
    );
    await expect(endformDeck).toHaveAttribute('target', '_blank');
    await expect(endformDeck).toHaveAttribute('rel', 'noopener noreferrer');

    await expect(
      page.getByRole('link', { name: 'Infobip Shift 2026 slide deck on GitHub' })
    ).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/infobip-shift-2026-agentic-developer'
    );
    await expect(
      page.getByRole('link', { name: 'ZurichJS Conf 2026 slide deck on GitHub' })
    ).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/zurichjs-2026-bug-report-pr-out'
    );
    await expect(
      page.getByRole('link', { name: 'DevSum 2026 slide deck on GitHub' })
    ).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/devsum-2026-agentic-developer-mcps'
    );

    await expect(page.getByRole('link', { name: /invite me/i })).toHaveCount(0);

    await expect(page.getByRole('link', { name: 'conference videos' })).toHaveAttribute(
      'href',
      '/videos/tags/conference-talk'
    );

    const decksLink = page.getByRole('link', { name: 'slide decks on GitHub' });
    await expect(decksLink).toBeVisible();
    await expect(decksLink).toHaveAttribute('href', 'https://github.com/debs-obrien/decks');
    await expect(decksLink).toHaveAttribute('target', '_blank');
    await expect(decksLink).toHaveAttribute('rel', 'noopener noreferrer');

    await expect(page.getByRole('link', { name: 'email me' })).toHaveAttribute(
      'href',
      'mailto:dobriendev@gmail.com'
    );
  });
});
