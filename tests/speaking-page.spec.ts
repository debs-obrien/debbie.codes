import { expect, test } from './fixtures';

test.describe('Speaking page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/speaking');
  });

  test('shows empty upcoming and 2026 past talks from decks', async ({ page }) => {
    await expect(page).toHaveTitle(/Speaking/);
    await expect(page.getByRole('heading', { name: 'Talks', level: 1 })).toBeVisible();
    await expect(page.getByText(/I speak about Playwright/i)).toBeVisible();

    await expect(page.getByRole('heading', { name: 'Upcoming', level: 2 })).toBeVisible();
    await expect(
      page.getByText('No upcoming talks listed right now. Past talks and decks are below.')
    ).toBeVisible();

    await expect(page.getByRole('heading', { name: '2026 talks', level: 2 })).toBeVisible();

    await expect(page.getByText('DevSum 2026')).toBeVisible();
    await expect(
      page.getByText('The Agentic Developer: Orchestrating AI Workflows with MCPs')
    ).toBeVisible();
    await expect(page.getByText('June 2026 · Stockholm')).toBeVisible();

    await expect(page.getByText('ZurichJS Conf 2026')).toBeVisible();
    await expect(
      page.getByText('Bug Report In, Pull Request Out: Agentic CI with Playwright').first()
    ).toBeVisible();
    await expect(page.getByText('Fri 11 Sep 2026')).toBeVisible();

    await expect(page.getByText('Infobip Shift 2026')).toBeVisible();
    await expect(
      page.getByRole('heading', { name: 'The Agentic Developer', level: 3, exact: true })
    ).toBeVisible();
    await expect(page.getByText('Tue 15 Sep 2026 · Zadar')).toBeVisible();

    await expect(page.getByText('Endform', { exact: true })).toBeVisible();
    await expect(page.getByText('Online', { exact: true })).toBeVisible();

    await expect(page.getByText('Agentic Testing workshop')).toBeVisible();
    await expect(page.getByText('Agentic Testing with Playwright')).toBeVisible();

    const deckLinks = page.getByRole('link', { name: 'Slide deck on GitHub' });
    await expect(deckLinks).toHaveCount(5);
    await expect(deckLinks.nth(0)).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/devsum-2026-agentic-developer-mcps'
    );
    await expect(deckLinks.nth(1)).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/zurichjs-2026-bug-report-pr-out'
    );
    await expect(deckLinks.nth(2)).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/infobip-shift-2026-agentic-developer'
    );
    await expect(deckLinks.nth(3)).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/endform-2026-bug-report-pr-out'
    );
    await expect(deckLinks.nth(4)).toHaveAttribute(
      'href',
      'https://github.com/debs-obrien/decks/tree/main/workshop-agentic-testing-playwright'
    );
    await expect(deckLinks.first()).toHaveAttribute('target', '_blank');
    await expect(deckLinks.first()).toHaveAttribute('rel', 'noopener noreferrer');

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
