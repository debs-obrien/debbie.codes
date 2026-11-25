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

  test('Apple Podcasts is disabled coming soon, Spotify and YouTube open externally', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    const apple = page.getByRole('button', { name: 'Apple Podcasts, coming soon' });
    await expect(apple).toBeVisible();
    await expect(apple).toHaveAttribute('aria-disabled', 'true');
    await expect(page.getByRole('link', { name: 'Apple Podcasts' })).toHaveCount(0);

    await expect(page.getByRole('link', { name: 'Listen on Spotify (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://open.spotify.com/show/18L8sfkO2opyo4WKKaLxAA'
    );
    await expect(page.getByRole('link', { name: 'Watch on YouTube (opens in a new tab)' })).toHaveAttribute(
      'href',
      'https://youtu.be/RKdxx2QsWe8'
    );
  });

  test('chapter click sets the lite embed start and plays', async ({ page }) => {
    await page.goto('/coffee-with-debbie');

    const embed = page.locator('lite-youtube');
    await expect(embed).toBeVisible();

    const chapter = page.getByRole('link', { name: 'Play from 0:33, Why tech hiring feels broken' });
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

test.describe('Podcasts index My show + guest filter', () => {
  test('leads with My show card and Guest appearances', async ({ page }) => {
    await page.goto('/podcasts');

    await expect(page.getByRole('heading', { level: 1, name: 'Podcasts' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Listen to Coffee with Debbie, my weekly video podcast' })).toHaveAttribute(
      'href',
      '/coffee-with-debbie'
    );
    await expect(page.getByRole('heading', { level: 2, name: 'Guest appearances' })).toBeVisible();
    await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toHaveCount(0);
    await expect(page.getByRole('heading', { level: 3, name: 'Want me on your podcast?' })).toBeVisible();
  });

  test('search filters guest appearances only and keeps My show visible', async ({ page }) => {
    await page.goto('/podcasts');

    const myShow = page.getByRole('link', { name: 'Listen to Coffee with Debbie, my weekly video podcast' });
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
