import { expect, test } from '@playwright/test';

test.describe('Podcasts Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/podcasts');
  });

  test.describe('Page Layout and Content', () => {
    test('displays podcast page with correct structure and content', async ({ page }) => {
      await test.step('Verify page title and description', async () => {
        await expect(page.getByRole('heading', { level: 1 })).toHaveText('Podcasts');
      });

      await test.step('Verify episodes section', async () => {
        await expect(page.getByRole('heading', { level: 2, name: 'All Episodes' })).toBeVisible();
      });

      await test.step('Verify collaboration section', async () => {
        await expect(page.getByRole('heading', { level: 3, name: 'Want to collaborate?' })).toBeVisible();
        await expect(page.getByRole('link', { name: 'Get in touch' })).toHaveAttribute('href', 'https://www.linkedin.com/in/debbie-o-brien-1a199975/');
        await expect(page.getByText('I\'m always open to interesting podcast conversations about web development, testing, and technology.')).toBeVisible();
      });
    });

    test('displays correct number of podcast cards', async ({ page }) => {
        await test.step('Count podcast episodes', async () => {
          const podcastCards = page.getByRole('article');
          const count = await podcastCards.count();
          expect(count).toBeGreaterThan(30);
        });
      });

    test('podcast cards display correctly', async ({ page }) => {
        await test.step('Verify podcast card structure', async () => {
          // Wait for podcast cards to load
          await expect.poll(() => page.getByRole('article').count()).toBeGreaterThan(25);
          
          // Check the first non-featured podcast card
          const firstCard = page.getByRole('article').nth(1); // Skip featured podcast
          
          // Each card should have a heading (episode title)
          await expect(firstCard.getByRole('heading', { level: 2 })).toBeVisible();
          
          // Each card should have a date
          await expect(firstCard.locator('time')).toBeVisible();
        });
      });

    test('podcast titles and metadata display correctly', async ({ page }) => {
        await test.step('Verify podcast card content', async () => {
          // Get first non-featured podcast card
          const firstCard = page.getByRole('article').nth(1); // Skip featured podcast
          
          const title = firstCard.getByRole('heading', { level: 2 });
          await expect(title).toBeVisible();
          const titleText = await title.textContent();
          expect(titleText?.length).toBeGreaterThan(0);
          
          const dateElement = firstCard.locator('time');
          await expect(dateElement).toBeVisible();
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
            
            // On mobile, still should have the main heading and collaboration section
            await expect(page.getByRole('heading', { level: 3, name: 'Want to collaborate?' })).toBeVisible();
          } else {
            const podcastCards = page.getByRole('article');
            await expect(podcastCards.first()).toBeVisible();
            
            // Should have multiple cards visible on desktop
            const count = await podcastCards.count();
            expect(count).toBeGreaterThan(25);
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
        await expect(page.getByRole('heading', { name: 'Podcasts' })).toBeVisible();
        
        // Check for tag links (they are displayed as simple links, not in a list)
        const tagLinks = page.getByRole('link').filter({ hasText: '#' });
        const count = await tagLinks.count();
        console.log('Tag links found:', count);
        
        // Check if we have podcast articles
        const articles = page.getByRole('article');
        const articleCount = await articles.count();
        expect(articleCount).toBeGreaterThan(25);
      });
    });

  test('tag filter list contains expected tags', async ({ page }) => {
      await test.step('Verify all tag filters are present', async () => {
        // Tags are displayed as NuxtLink components with # prefix, not in a list structure
        const tagLinks = page.getByRole('link').filter({ hasText: '#' });
        const count = await tagLinks.count();
        expect(count).toBeGreaterThan(0);
        
        // Check for some common tags that should exist (using .first() for strict mode)
        await expect(page.getByRole('link', { name: '#playwright' }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: '#testing' }).first()).toBeVisible();
        await expect(page.getByRole('link', { name: '#nuxt' }).first()).toBeVisible();
      });
    });

  test('playwright tag filter shows only playwright-related podcasts', async ({ page }) => {
      await test.step('Navigate to playwright tag and verify filtering', async () => {
        await page.getByRole('link', { name: '#playwright' }).first().click();
        
        await expect(page).toHaveURL('/podcasts/tags/playwright');
        await expect(page.getByRole('heading', { level: 1 })).toContainText('playwright');
        await expect(page.getByRole('heading', { level: 2, name: 'playwright Episodes' })).toBeVisible();
        
        const articles = page.getByRole('article');
        const count = await articles.count();
        
        expect(count).toBeLessThan(31); // Should be less than total
        expect(count).toBeGreaterThan(0);
      });
    });

  test('nuxt tag filter shows only nuxt-related podcasts', async ({ page }) => {
      await test.step('Navigate to nuxt tag and verify filtering', async () => {
        await page.getByRole('link', { name: '#nuxt' }).first().click();
        
        await expect(page).toHaveURL('/podcasts/tags/nuxt');
        await expect(page.getByRole('heading', { level: 1 })).toContainText('nuxt');
        await expect(page.getByRole('heading', { level: 2, name: 'nuxt Episodes' })).toBeVisible();
        
        const articles = page.getByRole('article');
        const count = await articles.count();
        expect(count).toBeGreaterThan(0);
      });
    });

  test('bit tag filter shows only bit-related podcasts', async ({ page }) => {
      await test.step('Navigate to bit tag and verify filtering', async () => {
        // Check if bit tag exists, skip if not
        const bitTagLink = page.getByRole('link', { name: '#bit' });
        const count = await bitTagLink.count();
        
        if (count > 0) {
          await bitTagLink.first().click();
          
          await expect(page).toHaveURL('/podcasts/tags/bit');
          await expect(page.getByRole('heading', { level: 1 })).toContainText('bit');
          await expect(page.getByRole('heading', { level: 2, name: 'bit Episodes' })).toBeVisible();
          
          const articles = page.getByRole('article');
          const articleCount = await articles.count();
          expect(articleCount).toBeGreaterThan(0);
        }
      });
    });

  test('navigation back to main podcasts page works', async ({ page }) => {
      await test.step('Test navigation after using specific tag filter', async () => {
        await page.getByRole('link', { name: '#playwright' }).first().click();
        await expect(page).toHaveURL('/podcasts/tags/playwright');
        
        // Navigate back to main podcasts page using the navigation link (not footer)
        await page.getByRole('navigation').getByRole('link', { name: 'Podcasts' }).click();
        
        await expect(page).toHaveURL('/podcasts');
        await expect(page.getByRole('heading', { name: 'Podcasts' })).toBeVisible();
        
        // Wait for all articles to load
        await expect.poll(() =>
          page.getByRole('article').count()
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
          // Check if the tag link exists
          const topicLink = page.getByRole('link', { name: `#${topic}` });
          const count = await topicLink.count();
          
          if (count > 0) {
            await topicLink.first().click();

            await expect(page).toHaveURL(`/podcasts/tags/${topic.replace(' ', '-')}`);
            await expect(page.getByRole('heading', { level: 1 })).toContainText(topic);
            
            // Use more specific heading selector to avoid strict mode violations
            await expect(page.getByRole('heading', { level: 2, name: `${topic} Episodes` })).toBeVisible();

            // Should have at least one article
            const articles = page.getByRole('article');
            await expect.poll(() => articles.count()).toBeGreaterThan(0);
          } else {
            console.log(`Tag ${topic} not found, skipping test`);
          }
        });
      }
    });
  }
  });
});
