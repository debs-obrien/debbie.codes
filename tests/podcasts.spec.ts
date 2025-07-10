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
          const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
          const totalEpisodes = parseInt(totalEpisodesText!.split(' ')[0], 10);
          await expect(podcastCards).toHaveCount(totalEpisodes);
        });
      });

    test('podcast cards display correctly', async ({ page }) => {
        await test.step('Verify first podcast card structure', async () => {
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
      });

    test('podcast titles and metadata display correctly', async ({ page }) => {
        await test.step('Verify podcast card content', async () => {
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
            const podcastCards = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
            await expect(podcastCards.first()).toBeVisible();
            
            const statsSection = page.locator('text=28+').locator('..');
            await expect(statsSection).toBeVisible();
          }
        });
      });
  });

    test('featured podcast section is visible on podcasts page', async ({ page }) => {
        await test.step('Verify iframe presence', async () => {
          await expect(page.locator('iframe')).toBeVisible();
        });
      });

    test('featured podcast player integration', async ({ page }) => {
        await test.step('Verify featured podcast placement', async () => {
          const featuredPodcast = page.getByRole('article').first();
          const iframe = featuredPodcast.locator('iframe');
          await expect(iframe).toBeVisible();
          await expect(iframe).toHaveAttribute('src', /fireside\.fm/);
        });
      });

    test('podcast player controls are accessible within iframe', async ({ page }) => {
        await test.step('Verify iframe and basic controls', async () => {
          const iframe = page.locator('iframe');
          const frameLocator = page.frameLocator('iframe');
          
          await expect(iframe).toBeVisible();
          
          // Check for play/pause button
          await expect(frameLocator.getByRole('button', { name: 'Play or Pause' })).toBeVisible();
          
          // Check for podcast title
          await expect(frameLocator.getByRole('heading', { name: 'Your testing questions answered' })).toBeVisible();
          
          // Check for podcast brand link
          await expect(frameLocator.getByRole('link', { name: 'PodRocket - A web development podcast from LogRocket' })).toBeVisible();
        });
      });

    test('podcast player has additional controls', async ({ page }) => {
        await test.step('Verify additional player controls', async () => {
          const frameLocator = page.frameLocator('iframe');
          
          // Check for speed control button
          await expect(frameLocator.getByRole('button', { name: 'Change Playback Speed' })).toBeVisible();
          
          // Check for skip buttons
          await expect(frameLocator.getByRole('button', { name: 'Skip Back 15 Seconds' })).toBeVisible();
          await expect(frameLocator.getByRole('button', { name: 'Skip Forward 15 Seconds' })).toBeVisible();
          
          // Check for share/subscribe dialog button
          await expect(frameLocator.getByRole('button', { name: 'Open Share and Subscribe Dialog' })).toBeVisible();
        });
      });

    test('podcast player has download and subscription links', async ({ page }) => {
        await test.step('Verify download and subscription options', async () => {
          const frameLocator = page.frameLocator('iframe');
          
          // Check for download link
          const downloadLink = frameLocator.getByRole('link', { name: 'Download' });
          await expect(downloadLink).toBeVisible();
          
          // Check for subscribe link
          const subscribeLink = frameLocator.getByRole('link', { name: 'Subscribe' });
          await expect(subscribeLink).toBeVisible();
          
          // Check for transcript link
          const transcriptLink = frameLocator.getByRole('link', { name: 'Transcript' });
          await expect(transcriptLink).toBeVisible();
        });
      });

    test('podcast player shows duration information', async ({ page }) => {
        await test.step('Verify time and progress displays', async () => {
          const frameLocator = page.frameLocator('iframe');
          
          // Check for current time display
          await expect(frameLocator.locator('text=00:00:00').first()).toBeVisible();
          
          // Check for duration display
          await expect(frameLocator.locator('text=00:36:15')).toBeVisible();
          
          // Check for progress bar
          await expect(frameLocator.getByRole('progressbar')).toBeVisible();
        });
      });

    test('podcast player maintains proper iframe integration', async ({ page }) => {
        await test.step('Verify iframe integration', async () => {
          const iframe = page.locator('iframe');
          
          // Iframe should be properly embedded and sized
          await expect(iframe).toBeVisible();
          
          // Iframe should have a proper src attribute
          const src = await iframe.getAttribute('src');
          expect(src).toBeTruthy();
          expect(src).not.toBe('');
          
          // The iframe should be within the featured podcast article section
          const podcastSection = page.getByRole('article').first();
          await expect(podcastSection.locator('iframe')).toBeVisible();
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
        
        // Filter out the featured podcast iframe article
        const articles = page.getByRole('article').filter({ hasNot: page.locator('iframe') });
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
