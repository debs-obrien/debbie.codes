import AxeBuilder from '@axe-core/playwright';
import { expect, test } from './fixtures';

test.describe('Coffee with Debbie show page', () => {
  test('renders the show page with hero, episode, and chapters', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    await expect(page.getByRole('heading', { level: 1, name: 'Coffee with Debbie' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Back to podcasts' })).toHaveAttribute('href', '/podcasts');
    await expect(page.getByRole('heading', { level: 2, name: 'Latest episode' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'All episodes' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Read the blog post' })).toHaveAttribute(
      'href',
      '/blog/coffee-with-debbie-1-is-tech-hiring-broken'
    );
    await expect(page.getByRole('link', { name: 'Suggest one on the contact page' })).toHaveAttribute(
      'href',
      '/contact'
    );

    await expect(page.getByRole('navigation', { name: 'Chapters' })).toBeVisible();
    await expect(page.locator('lite-youtube')).toHaveCount(1);
    await expect(page.getByText('The video loads from YouTube only when you press play.')).toBeVisible();
  });

  test('Spotify, YouTube, and Apple Podcasts open externally', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    const listenGroup = page.getByRole('group', { name: 'Listen on' });
    await expect(listenGroup.getByRole('link', { name: 'Listen on Spotify (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/show/18L8sfkO2opyo4WKKaLxAA'
    );
    await expect(listenGroup.getByRole('link', { name: 'Watch on YouTube (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://youtu.be/RKdxx2QsWe8'
    );
    await expect(listenGroup.getByRole('link', { name: 'Listen on Apple Podcasts (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://podcasts.apple.com/us/podcast/coffee-with-debbie/id6839372563'
    );
    await expect(page.getByRole('button', { name: 'Apple Podcasts, coming soon' })).toHaveCount(0);
  });

  test('chapter links use visible text as their accessible name', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    const chaptersNav = page.getByRole('navigation', { name: 'Chapters' });
    const chapterLinks = chaptersNav.getByRole('link');
    await expect(chapterLinks).toHaveCount(14);

    for (const link of await chapterLinks.all()) {
      await expect(link).not.toHaveAttribute('aria-label');
      const visible = (await link.innerText()).replace(/\s+/g, ' ').trim();
      expect(visible.length).toBeGreaterThan(0);
      await expect(link).toHaveAccessibleName(visible);
    }

    const axe = await new AxeBuilder({ page })
      .include('nav[aria-labelledby="chapters-heading"]')
      .withRules(['label-content-name-mismatch'])
      .analyze();
    expect(axe.violations, JSON.stringify(axe.violations, null, 2)).toEqual([]);
  });

  test('chapter click sets the lite embed start and plays', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    const embed = page.locator('lite-youtube');
    await expect(embed).toBeVisible();

    const chapter = page.getByRole('navigation', { name: 'Chapters' }).getByRole('link', {
      name: '0:33 Why tech hiring feels broken',
    });
    await chapter.click();

    await expect.poll(async () => {
      const params = await embed.getAttribute('params');
      return params || '';
    }).toContain('start=33');

    await expect.poll(async () => {
      return embed.evaluate(el => el.classList.contains('lyt-activated'));
    }).toBe(true);
  });

  test('Podcasts nav is active on the show page', async ({ page, isMobile }) => {
    test.skip(isMobile, 'Desktop nav active state');
    await page.goto('/coffee-with-debbie');
    const podcastsNav = page.getByRole('navigation').getByRole('link', { name: 'Podcasts' });
    await expect(podcastsNav).toHaveAttribute('aria-current', 'page');
  });
});

test.describe('Podcasts index show-first order', () => {
  test('leads with Coffee with Debbie section before Guest appearances', async ({ page }) => {
    await page.goto('/podcasts');

    await expect(page.getByRole('heading', { level: 1, name: 'Podcasts' })).toBeVisible();

    const myShow = page.getByTestId('my-show-section');
    const guestHeading = page.getByRole('heading', { level: 2, name: 'Guest appearances' });
    await expect(myShow).toBeVisible();
    await expect(guestHeading).toBeVisible();

    const order = await page.evaluate(() => {
      const show = document.querySelector('[data-testid="my-show-section"]');
      const guest = Array.from(document.querySelectorAll('h2')).find(h => h.textContent?.trim() === 'Guest appearances');
      if (!show || !guest)
        return null;
      return show.compareDocumentPosition(guest) & Node.DOCUMENT_POSITION_FOLLOWING ? 'show-then-guest' : 'guest-first';
    });
    expect(order).toBe('show-then-guest');

    await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toHaveCount(0);
  });

  test('show section has cover, latest episode, and live listen links', async ({ page }) => {
    await page.goto('/podcasts');

    const myShow = page.getByTestId('my-show-section');
    await expect(myShow.getByRole('heading', { level: 2, name: 'Coffee with Debbie' })).toBeVisible();
    await expect(myShow.getByRole('img', { name: 'Coffee with Debbie cover art' })).toBeVisible();
    await expect(myShow.getByTestId('my-show-latest-episode')).toBeVisible();
    await expect(myShow.getByTestId('my-show-latest-episode').getByRole('link', { name: 'Open the show page' })).toHaveAttribute(
      'href',
      '/coffee-with-debbie'
    );

    const listenGroup = myShow.getByRole('group', { name: 'Listen on' });
    await expect(listenGroup.getByRole('link', { name: 'Listen on Spotify (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/show/18L8sfkO2opyo4WKKaLxAA'
    );
    await expect(listenGroup.getByRole('link', { name: 'Watch on YouTube (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://youtu.be/RKdxx2QsWe8'
    );
    await expect(listenGroup.getByRole('link', { name: 'Listen on Apple Podcasts (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://podcasts.apple.com/us/podcast/coffee-with-debbie/id6839372563'
    );
  });

  test('search filters guest appearances only and keeps My show visible', async ({ page }) => {
    await page.goto('/podcasts');

    const myShow = page.getByTestId('my-show-section');
    await expect(myShow).toBeVisible();

    // Retry fill until hydration attaches BlogSearch (same pattern as blog-search.spec.ts).
    const search = page.getByRole('searchbox', { name: 'Search guest appearances' });
    await expect(async () => {
      await search.fill('playwright');
      await expect(page.getByRole('heading', { level: 2, name: /Search Results/ })).toBeVisible();
    }).toPass({ timeout: 10_000 });

    await expect(myShow).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'Guest appearances' })).toHaveCount(0);
  });
});
