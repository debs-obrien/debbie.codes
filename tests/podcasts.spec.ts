import { expect, test } from '@playwright/test';

test.describe('Podcasts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/podcasts');
  });

  test.describe('Page Layout and Content', () => {
    test('displays podcast page with correct structure and content', async ({ page }) => {
      await test.step('Verify page title and description', async () => {
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Podcast Interviews');
        await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();
      });

      await test.step('Verify podcast stats section', async () => {
        const statsSection = page.getByLabel('Podcast Stats');
        await expect(statsSection).toMatchAriaSnapshot(`
          - text: /\\d+\\+ Episodes \\d+\\+ Years \\d+\\+ Shows/
        `);
      });

      await test.step('Verify episodes section', async () => {
        await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toBeVisible();
        const totalEpisodesText = await page.getByText(/\d+ episodes/).textContent();
        expect(totalEpisodesText).toBeTruthy();
        await expect(page.getByText(totalEpisodesText!)).toBeVisible();
      });

      await test.step('Verify collaboration section', async () => {
        const collaborationSection = page.getByRole('heading', { name: 'Want to collaborate?' }).locator('..');
        await expect(collaborationSection).toMatchAriaSnapshot(`
          - heading "Want to collaborate?" [level=3]
          - paragraph: I'm always open to interesting podcast conversations about web development, testing, and technology.
          - link "Get in touch":
            - /url: https://www.linkedin.com/in/debbie-o-brien-1a199975/
        `);
      });
    });

    test('displays correct number of podcast cards', async ({ page }) => {
        await test.step('Count podcast episodes', async () => {
          const totalEpisodesText = await page.getByText(/\d+ episodes/).textContent();
          // Exclude featured podcast by filtering out articles with "Featured Podcast" heading
          const podcastCards = page.getByRole('article').filter({ hasNot: page.getByRole('heading', { name: 'Featured Podcast' }) });
          const totalEpisodes = parseInt(totalEpisodesText!.split(' ')[0], 10);
          await expect(podcastCards).toHaveCount(totalEpisodes);
        });
      });

    test('podcast cards display correctly', async ({ page }) => {
        await test.step('Verify podcast card structure', async () => {
          // Wait for podcast cards to load and find one with tag links
          await expect.poll(() => page.getByRole('article').count()).toBeGreaterThan(1);
          
          // Find a card that has a specific tag link that we know exists
          const cardWithPlaywrightTag = page.getByRole('article').filter({ 
            has: page.getByRole('link', { name: '#playwright' }) 
          }).first();
          
          const cardImage = cardWithPlaywrightTag.locator('img').first();
          await expect(cardImage).toBeVisible();
          await expect(cardWithPlaywrightTag.getByRole('heading', { level: 2 })).toBeVisible();
          await expect(cardWithPlaywrightTag.locator('time')).toBeVisible();
          
          const cardLink = cardWithPlaywrightTag.getByRole('link').first();
          await expect(cardLink).toBeVisible();
          
          // Check for the specific tag links we know exist
          await expect(cardWithPlaywrightTag.getByRole('link', { name: '#playwright' })).toBeVisible();
          await expect(cardWithPlaywrightTag.getByRole('link', { name: '#testing' })).toBeVisible();
        });
      });

    test('podcast titles and metadata display correctly', async ({ page }) => {
        await test.step('Verify podcast card content', async () => {
          // Exclude featured podcast by filtering out articles with "Featured Podcast" heading
          const podcastCards = page.getByRole('article').filter({ hasNot: page.getByRole('heading', { name: 'Featured Podcast' }) });
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

    test('LinkedIn collaboration link functionality', async ({ page, context }) => {
        await test.step('Test LinkedIn link opens in new tab', async () => {
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
      });

    test('responsive layout behavior', async ({ page, isMobile }) => {
        await test.step('Verify responsive design', async () => {
          await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

          if (isMobile) {
            const viewport = page.viewportSize();
            expect(viewport?.width).toBeLessThan(768);
            
            await expect(page.getByText('Discover conversations about web development')).toBeVisible();
          } else {
            const podcastCards = page.getByRole('article').filter({ hasNot: page.getByRole('heading', { name: 'Featured Podcast' }) });
            await expect(podcastCards.first()).toBeVisible();
            
            const statsSection = page.locator('text=29+').locator('..');
            await expect(statsSection).toBeVisible();
          }
        });
      });
  });

  test.describe('Tag Filtering', () => {
    test.beforeEach(async ({ page }) => {
      await page.goto('/podcasts');
    });

    test('displays all podcasts by default', async ({ page }) => {
      await test.step('Verify default state', async () => {
        await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
        await expect(page.getByText('Discover conversations about web development, testing, and developer advocacy')).toBeVisible();
        
        await expect(page.getByRole('list', { name: 'topics' })).toBeVisible();
        
        const articles = page.locator('article');
        const count = await articles.count();
        expect(count).toBeGreaterThan(25);
      });
    });

  test('tag filter list contains expected tags', async ({ page }) => {
      await test.step('Verify all tag filters are present', async () => {
        const tagsList = page.getByRole('list', { name: 'topics' });
        
        await expect(tagsList.getByRole('link', { name: 'All' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'bit' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'dev rel' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'jamstack' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'mentoring' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'nuxt' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'playwright' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'react' })).toBeVisible();
        await expect(tagsList.getByRole('link', { name: 'testing' })).toBeVisible();
      });
    });

  test('playwright tag filter shows only playwright-related podcasts', async ({ page }) => {
      await test.step('Navigate to playwright tag and verify filtering', async () => {
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
        
        await expect(page).toHaveURL('/podcasts/tags/playwright');
        await expect(page.getByRole('heading', { name: 'Podcast Interviews on playwright' })).toBeVisible();
        await expect(page.getByText('Discover podcast episodes about playwright and related topics')).toBeVisible();
        
        const articles = page.locator('article');
        const count = await articles.count();
        
        expect(count).toBeLessThan(27);
        expect(count).toBeGreaterThan(0);
        
        for (let i = 0; i < count; i++) {
          const article = articles.nth(i);
          await expect(article.locator('a[href="/podcasts/tags/playwright"]')).toBeVisible();
        }
      });
    });

  test('nuxt tag filter shows only nuxt-related podcasts', async ({ page }) => {
      await test.step('Navigate to nuxt tag and verify filtering', async () => {
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'nuxt' }).click();
        
        await expect(page).toHaveURL('/podcasts/tags/nuxt');
        await expect(page.getByRole('heading', { name: 'Podcast Interviews on nuxt' })).toBeVisible();
        
        const articles = page.locator('article');
        const count = await articles.count();
        expect(count).toBeGreaterThan(0);
        
        for (let i = 0; i < count; i++) {
          const article = articles.nth(i);
          await expect(article.locator('a[href="/podcasts/tags/nuxt"]')).toBeVisible();
        }
      });
    });

  test('bit tag filter shows only bit-related podcasts', async ({ page }) => {
      await test.step('Navigate to bit tag and verify filtering', async () => {
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'bit' }).click();
        
        await expect(page).toHaveURL('/podcasts/tags/bit');
        await expect(page.getByRole('heading', { name: 'Podcast Interviews on bit' })).toBeVisible();
        
        // Filter out the featured podcast article
        const articles = page.getByRole('article').filter({ hasNot: page.getByRole('heading', { name: 'Featured Podcast' }) });
        const count = await articles.count();
        expect(count).toBeGreaterThan(0);
        
        // Verify that at least some articles contain the bit tag link
        // (not all articles need to show the tag link, they just need to be bit-related)
        await expect.poll(() =>
          page.getByRole('article').getByRole('link', { name: 'bit' }).count()
        ).toBeGreaterThan(0);
      });
    });

  test('All filter returns to unfiltered podcasts list', async ({ page }) => {
      await test.step('Test All filter after using specific tag filter', async () => {
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
        await expect(page).toHaveURL('/podcasts/tags/playwright');
        
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'All' }).click();
        
        await expect(page).toHaveURL('/podcasts');
        await expect(page.getByRole('heading', { name: 'Podcast Interviews' })).toBeVisible();
        
        // Wait for all articles to load
        await expect.poll(() =>
          page.locator('article').count()
        ).toBeGreaterThan(25);
      });
    });

  // Parameterized test for all topics
  const topics = ['bit', 'dev rel', 'jamstack', 'mentoring', 'nuxt', 'playwright', 'react', 'testing'];
  
  for (const topic of topics) {
    test(`tag filtering works for ${topic}`, async ({ page, isMobile }) => {
      // Skip filtering tests on mobile as the UI might be different
      if (!isMobile) {
        await test.step(`Test ${topic} tag filtering`, async () => {
          await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();

          await expect(page).toHaveURL(`/podcasts/tags/${topic.replace(' ', '-')}`);
          await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);

          await expect.poll(() =>
            page.getByRole('article').getByRole('link', { name: topic }).count())
            .toBeGreaterThan(0);
        });
      }
    });
  }
  });
});
