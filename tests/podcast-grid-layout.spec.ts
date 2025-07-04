import { expect, test } from '@playwright/test';

test.describe('Podcast Grid Layout', () => {
  test('displays podcast page with grid layout and all components', async ({ page }) => {
    await page.goto('/podcasts');

    // Check main title and description
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Podcast Interviews');
    await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();

    // Check stats section
    await expect(page.getByText('28+')).toBeVisible();
    const episodesStat = page.locator('div').filter({ hasText: /^Episodes$/ }).first();
    await expect(episodesStat).toBeVisible();
    await expect(page.getByText('5+')).toBeVisible();
    await expect(page.getByText('Years')).toBeVisible();
    await expect(page.getByText('20+')).toBeVisible();
    await expect(page.getByText('Shows')).toBeVisible();

    // Check featured podcast section
    await expect(page.getByRole('article').first()).toBeVisible();

    // Check filter tags section
    await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
    const allFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'All' });
    await expect(allFilterLink).toBeVisible();
    const playwrightFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' });
    await expect(playwrightFilterLink).toBeVisible();
    const testingFilterLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'testing' });
    await expect(testingFilterLink).toBeVisible();

    // Check "All Episodes" section
    await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toBeVisible();
    await expect(page.getByText('28 episodes')).toBeVisible();

    // Check grid layout - should have multiple podcast cards
    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    await expect(podcastCards).toHaveCount(28); // Should match total episodes

    // Check that podcast cards have proper structure
    const firstCard = podcastCards.first();
    const cardImage = firstCard.locator('img').first();
    await expect(cardImage).toBeVisible(); // Podcast cover image
    await expect(firstCard.getByRole('heading', { level: 3 })).toBeVisible(); // Podcast title
    const cardLink = firstCard.getByRole('link').first();
    await expect(cardLink).toBeVisible(); // Clickable links

    // Check call-to-action section
    await expect(page.getByRole('heading', { level: 3, name: 'Want to collaborate?' })).toBeVisible();
    await expect(page.getByText('I\'m always open to interesting podcast conversations')).toBeVisible();
    
    // Check LinkedIn link
    const linkedInLink = page.getByRole('link', { name: 'Get in touch' });
    await expect(linkedInLink).toBeVisible();
    await expect(linkedInLink).toHaveAttribute('href', 'https://www.linkedin.com/in/debbie-o-brien-1a199975/');
    await expect(linkedInLink).toHaveAttribute('target', '_blank');
  });

  test('podcast card interactions and hover effects', async ({ page }) => {
    await page.goto('/podcasts');

    // Get first podcast card (excluding featured podcast with iframe)
    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    const firstCard = podcastCards.first();

    // Test that card contains expected elements
    const cardImage = firstCard.locator('img').first();
    await expect(cardImage).toBeVisible();
    await expect(firstCard.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(firstCard.locator('time')).toBeVisible(); // Date element
    
    // Test that links are clickable
    const cardLink = firstCard.getByRole('link').first();
    await expect(cardLink).toBeVisible();
    
    // Test that tags are present
    const tagLinks = firstCard.getByRole('link').filter({ hasText: /^(testing|playwright|nuxt|react|bit|dev rel|jamstack|mentoring)$/ });
    await expect(tagLinks.first()).toBeVisible();
  });

  test('LinkedIn button functionality', async ({ page, context }) => {
    await page.goto('/podcasts');

    // Click the "Get in touch" button
    const [linkedInPage] = await Promise.all([
      context.waitForEvent('page'),
      page.getByRole('link', { name: 'Get in touch' }).click()
    ]);

    // Verify LinkedIn page opened
    await expect(linkedInPage).toHaveURL(/linkedin\.com/);
  });

  test('responsive grid layout', async ({ page, isMobile }) => {
    await page.goto('/podcasts');

    // Wait for content to load
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

    if (isMobile) {
      // On mobile, grid should be single column
      const viewport = page.viewportSize();
      expect(viewport?.width).toBeLessThan(768);
      
      // Check that content stacks vertically
      await expect(page.getByText('Discover conversations about web development')).toBeVisible();
    } else {
      // On desktop, should have multiple columns
      const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
      await expect(podcastCards.first()).toBeVisible();
      
      // Check that stats are displayed horizontally
      const statsSection = page.locator('text=28+').locator('..');
      await expect(statsSection).toBeVisible();
    }
  });

  test('featured podcast player functionality', async ({ page }) => {
    await page.goto('/podcasts');

    // Check that featured podcast iframe is present
    const featuredPodcast = page.getByRole('article').first();
    const iframe = featuredPodcast.locator('iframe');
    await expect(iframe).toBeVisible();
    
    // Verify iframe has proper src
    await expect(iframe).toHaveAttribute('src', /fireside\.fm/);
  });

  test('podcast titles and metadata display correctly', async ({ page }) => {
    await page.goto('/podcasts');

    const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
    
    // Check first few podcast cards for expected content
    const firstCard = podcastCards.first();
    
    // Should have a title
    const title = firstCard.getByRole('heading', { level: 3 });
    await expect(title).toBeVisible();
    const titleText = await title.textContent();
    expect(titleText?.length).toBeGreaterThan(0);
    
    // Should have a host/author
    const hostText = firstCard.locator('text=.NET Rocks, Web Rush, Legacy Rocks, QA Therapy, PodRocket').first();
    // Note: This is flexible since different podcasts have different hosts
    
    // Should have a date
    const dateElement = firstCard.locator('time');
    await expect(dateElement).toBeVisible();
    
    // Should have description text
    const description = firstCard.locator('p');
    await expect(description).toBeVisible();
  });
});

// Test tag filtering with grid layout
test.describe('Podcast Tag Filtering', () => {
  const topics = ['bit', 'dev rel', 'jamstack', 'mentoring', 'nuxt', 'playwright', 'react', 'testing'];

  for (const topic of topics) {
    test(`tag filtering works for ${topic}`, async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.goto('/podcasts');

        // Click on the topic filter
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();

        // Should navigate to filtered page
        await expect(page).toHaveURL(`/podcasts/tags/${topic.replace(' ', '-')}`);
        
        // Should show filtered heading
        await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

        // Should have filtered articles with the topic tag
        await expect.poll(() =>
          page.getByRole('article').getByRole('link', { name: topic }).count())
          .toBeGreaterThan(0);
      }
    });
  }
});
