import { expect, test } from '@playwright/test';

test.describe('Podcast Grid Layout', () => {
  test('displays podcast page with grid layout and all components', async ({ page }) => {
    await page.goto('/podcasts');

    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Podcast Interviews');
    await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();

    const statsSection = page.getByLabel('Podcast Stats');
    await expect(statsSection).toMatchAriaSnapshot(`
      - text: /\\d+\\+ Episodes 5\\+ Years \\d+\\+ Shows/
    `);

    await expect(page.getByRole('article').first()).toBeVisible();

    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    const allFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'All' });
    await expect(allFilterLink).toBeVisible();
    const playwrightFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' });
    await expect(playwrightFilterLink).toBeVisible();
    const testingFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'testing' });
    await expect(testingFilterLink).toBeVisible();

    await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toBeVisible();
    const totalEpisodesText = await page.getByText(/\d+ episodes/).textContent();
    expect(totalEpisodesText).toBeTruthy();
    await expect(page.getByText(totalEpisodesText!)).toBeVisible();

    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    const totalEpisodes = parseInt(totalEpisodesText!.split(' ')[0], 10);
    await expect(podcastCards).toHaveCount(totalEpisodes);
    const firstCard = podcastCards.first();
    const cardImage = firstCard.locator('img').first();
    await expect(cardImage).toBeVisible();
    await expect(firstCard.getByRole('heading', { level: 2 })).toBeVisible();
    const cardLink = firstCard.getByRole('link').first();
    await expect(cardLink).toBeVisible();

    await expect(page.getByRole('heading', { level: 3, name: 'Want to collaborate?' })).toBeVisible();
    await expect(page.getByText('I\'m always open to interesting podcast conversations')).toBeVisible();
    
    const linkedInLink = page.getByRole('link', { name: 'Get in touch' });
    await expect(linkedInLink).toBeVisible();
    await expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/debbie-o-brien-1a199975/');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
  });

  test('podcast card interactions and hover effects', async ({ page }) => {
    await page.goto('/podcasts');

    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    const firstCard = podcastCards.first();

    const cardImage = firstCard.locator('img').first();
    await expect(cardImage).toBeVisible();
    await expect(firstCard.getByRole('heading', { level: 2 })).toBeVisible();
    await expect(firstCard.locator('time')).toBeVisible();
    
    const cardLink = firstCard.getByRole('link').first();
    await expect(cardLink).toBeVisible();
    
    const tagLinks = firstCard.getByRole('link').filter({ hasText: /^(testing|playwright|nuxt|react|bit|dev rel|jamstack|mentoring)$/ });
    await expect(tagLinks.first()).toBeVisible();
  });

  test('LinkedIn button functionality', async ({ page, context }) => {
    await page.goto('/podcasts');

    await context.route('https://www.linkedin.com/**', route => {
      route.fulfill({
        status: 200,
        contentType: 'text/html',
        body: '<html><body>Mocked LinkedIn Page</body></html>'
      });
    });

    const [linkedInPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Get in touch' }).click()
    ]);

    await expect(linkedInPage).toHaveURL('https://www.linkedin.com/in/debbie-o-brien-1a199975/');
    
    await expect(linkedInPage.locator('body')).toContainText('Mocked LinkedIn Page');
  });

  test('responsive grid layout', async ({ page, isMobile }) => {
    await page.goto('/podcasts');

    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    if (isMobile) {
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeLessThan(768);
      
      await expect(page.getByText('Discover conversations about web development')).toBeVisible();
    } else {
      const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
      await expect(podcastCards.first()).toBeVisible();
      
      const statsSection = page.locator('text=28+').locator('..');
      await expect(statsSection).toBeVisible();
    }
  });

  test('featured podcast player functionality', async ({ page }) => {
    await page.goto('/podcasts');

    const featuredPodcast = page.getByRole('article').first();
    const iframe = featuredPodcast.locator('iframe');
    await expect(iframe).toBeVisible();
    
    await expect(iframe).toHaveAttribute('src', /fireside\.fm/);
  });

  test('podcast titles and metadata display correctly', async ({ page }) => {
    await page.goto('/podcasts');

    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    
    const firstCard = podcastCards.first();
    
    const title = firstCard.getByRole('heading', { level: 2 });
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText?.length).toBeGreaterThan(0);
    
    const hostElement = firstCard.locator('.text-blue-600, .text-blue-400').first();
    await expect(hostElement).toBeVisible();
    const hostContent = await hostElement.textContent();
    expect(hostContent?.length).toBeGreaterThan(0);
    
    const dateElement = firstCard.locator('time');
    await expect(dateElement).toBeVisible();
    
    const description = firstCard.locator('p');
    await expect(description).toBeVisible();
  });
});

test.describe('Podcast Tag Filtering', () => {
  const topics = ['bit', 'dev rel', 'jamstack', 'mentoring', 'nuxt', 'playwright', 'react', 'testing'];

  for (const topic of topics) {
    test(`tag filtering works for ${topic}`, async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.goto('/podcasts');

        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();

        await expect(page).toHaveURL(`/podcasts/tags/${topic.replace(' ', '-')}`);
        
        await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

        await expect.poll(() =>
          page.getByRole('article').getByRole('link', { name: topic }).count())
          .toBeGreaterThan(0);
      }
    });
  }
});
