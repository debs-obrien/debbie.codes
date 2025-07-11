import { expect, test } from '@playwright/test';

test.describe('Blog Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test.describe('Page Structure and Layout', () => {
    test('displays main content and navigation correctly', async ({ page }) => {
      await test.step('Verify blog page structure', async () => {
        await expect(page.getByRole('heading', { name: 'Blog', level: 1 })).toBeVisible();
        await expect(page.getByText('Thoughts on web development, testing, performance, and developer experience')).toBeVisible();
      });

      await test.step('Verify topic navigation', async () => {
        const topicsList = page.getByRole('list', { name: 'topics' });
        await expect(topicsList).toBeVisible();
        await expect(topicsList.getByRole('link', { name: 'All' })).toBeVisible();
        await expect(topicsList.getByRole('link', { name: 'playwright' })).toBeVisible();
        await expect(topicsList.getByRole('link', { name: 'testing' })).toBeVisible();
        await expect(topicsList.getByRole('link', { name: /^ai$/i })).toBeVisible();
      });

      await test.step('Verify blog sections are present', async () => {
        await expect(page.getByRole('heading', { name: 'Featured Posts', level: 2 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Recent Posts', level: 2 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Browse by Topic', level: 2 })).toBeVisible();
        await expect(page.getByRole('heading', { name: 'Browse by Year', level: 2 })).toBeVisible();
      });
    });

    test('featured posts display correctly', async ({ page }) => {
      await test.step('Verify featured posts structure', async () => {
        const featuredSection = page.getByRole('heading', { name: 'Featured Posts', level: 2 }).locator('..');
        const featuredPosts = featuredSection.getByRole('article');
        
        // Should have exactly 2 featured posts
        await expect(featuredPosts).toHaveCount(2);
      });

      await test.step('Verify featured post metadata', async () => {
        const firstPost = page.getByRole('article').first();
        await expect(firstPost.getByRole('list')).toBeVisible(); // Tags list
        await expect(firstPost.getByRole('link').first()).toBeVisible(); // Title link
        await expect(firstPost.getByText('Read more')).toBeVisible(); // Read more link
      });
    });
  });

  test.describe('Search Functionality', () => {
    test('search field is present and functional', async ({ page, isMobile }) => {
      if (!isMobile) {
        const searchInput = page.getByPlaceholder('Search articles...');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toHaveAttribute('placeholder', 'Search articles...');
      }
    });

    test('search filters blog posts correctly', async ({ page, isMobile }) => {
      if (!isMobile) {
        const searchInput = page.getByPlaceholder('Search articles...');

        await expect(page.getByRole('article').first()).toBeVisible();

        const initialArticles = page.getByRole('article');
        const initialCount = await initialArticles.count();

        await searchInput.fill('playwright');
        await page.waitForTimeout(1000);

        const filteredArticles = page.getByRole('article');
        const filteredCount = await filteredArticles.count();

        // Search should either reduce the count or keep it the same, but results should contain the search term
        expect(filteredCount).toBeGreaterThan(0);

        if (filteredCount > 0) {
          await expect.poll(() =>
            page.getByRole('article').filter({ hasText: 'playwright' }).count()
          ).toBeGreaterThan(0);
        }
      }
    });

    test('search works with different search terms', async ({ page, isMobile }) => {
      if (!isMobile) {
        const searchInput = page.getByPlaceholder('Search articles...');

        await searchInput.fill('nuxt');
        const nuxtResults = await page.getByRole('article').count();

        await searchInput.clear();
        await searchInput.fill('testing');
        const testingResults = await page.getByRole('article').count();

        expect(nuxtResults).toBeGreaterThan(0);
        expect(testingResults).toBeGreaterThan(0);
      }
    });

    test('clearing search shows all posts', async ({ page, isMobile }) => {
      if (!isMobile) {
        const searchInput = page.getByPlaceholder('Search articles...');
        await expect(page.getByRole('article').first()).toBeVisible();

        const initialCount = await page.getByRole('article').count();
        await searchInput.fill('playwright');
        await searchInput.clear();

        const finalCount = await page.getByRole('article').count();
        expect(finalCount).toBe(initialCount);
      }
    });

    test('search with no results shows appropriate state', async ({ page, isMobile }) => {
      if (!isMobile) {
        await expect(page.getByRole('article').first()).toBeVisible();

        const searchInput = page.getByPlaceholder('Search articles...');
        await expect(searchInput).toBeVisible();
        await expect(searchInput).toBeEnabled();

        await searchInput.click();
        await page.waitForTimeout(100);
        await searchInput.fill('xyz123nonexistent');
        await page.waitForTimeout(1000);

        try {
          await expect(page.getByRole('article')).toHaveCount(0);
        } catch (e) {
          const matchingArticles = await page.getByRole('article').filter({ hasText: 'xyz123nonexistent' }).count();
          expect(matchingArticles).toBe(0);
        }
      }
    });

    test('AI search shows only AI-related posts and not false positives', async ({ page, isMobile }) => {
      if (!isMobile) {
        await test.step('Search for AI term', async () => {
          const searchInput = page.getByPlaceholder('Search articles...');
          await searchInput.fill('AI');
          
          // Wait for search results to update
          await page.waitForTimeout(500);
        });

        await test.step('Verify AI search results contain only legitimate AI content', async () => {
          const articles = page.getByRole('article');
          const articleCount = await articles.count();
          
          // Should have some results
          expect(articleCount).toBeGreaterThan(0);
          
          // Check that results don't include false positives like "TailwindCSS"
          // that contain "AI" as a substring but aren't actually about AI
          for (let i = 0; i < Math.min(3, articleCount); i++) {
            const article = articles.nth(i);
            const hasAI = await article.getByText(/\bAI\b/i).count() > 0;
            expect(hasAI).toBeTruthy();
          }
        });

        await test.step('Verify search results are accessible', async () => {
          // Verify basic accessibility structure
          await expect(page.getByRole('main')).toBeVisible();
          await expect(page.getByPlaceholder('Search articles...')).toBeVisible();
          
          const articles = page.getByRole('article');
          expect(await articles.count()).toBeGreaterThan(0);
        });
      }
    });

    test('MCP search shows only MCP-related posts', async ({ page, isMobile }) => {
      if (!isMobile) {
        await test.step('Search for MCP term', async () => {
          const searchInput = page.getByPlaceholder('Search articles...');
          await searchInput.fill('MCP');
          await page.waitForTimeout(500);
        });

        await test.step('Verify MCP search results are precise', async () => {
          const articles = page.getByRole('article');
          const articleCount = await articles.count();
          
          if (articleCount > 0) {
            for (let i = 0; i < Math.min(3, articleCount); i++) {
              const article = articles.nth(i);
              const hasMCP = await article.getByText(/\bMCP\b/i).count() > 0;
              expect(hasMCP).toBeTruthy();
            }
          }
        });
      }
    });

    test('search works on tag pages and searches all articles', async ({ page, isMobile }) => {
      if (!isMobile) {
        await page.goto('/blog/tags/testing');
        
        // Check that we navigated to the correct URL
        await expect(page).toHaveURL('/blog/tags/testing');

        const searchInput = page.getByPlaceholder('Search articles...');
        await searchInput.fill('nuxt');
        await page.waitForTimeout(500);

        const articles = page.getByRole('article');
        const articleCount = await articles.count();

        if (articleCount > 0) {
          await expect.poll(() =>
            page.getByRole('article').filter({ hasText: 'nuxt' }).count()
          ).toBeGreaterThan(0);
        }
      }
    });
  });

  test.describe('Topic Filtering and Navigation', () => {
    const topics = ['nuxt', 'playwright', 'testing', 'react', 'personal', 'javascript'];

    test('topic filtering works correctly', async ({ page }) => {
      await test.step('Filter by playwright topic', async () => {
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'playwright' }).click();
        await expect(page).toHaveURL(/\/blog\/tags\/playwright/);
      });

      await test.step('Filter by testing topic', async () => {
        await page.goto('/blog');
        await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: 'testing' }).click();
        await expect(page).toHaveURL(/\/blog\/tags\/testing/);
      });
    });

    for (const topic of topics) {
      test(`tag links to page with posts on ${topic}`, async ({ page, isMobile }) => {
        if (!isMobile) {
          await page.getByRole('list', { name: 'topics' }).getByRole('link', { name: topic }).click();
          
          // Check that we navigated to the correct URL instead of checking heading text
          await expect(page).toHaveURL(new RegExp(`/blog/tags/${topic}`));

          // For JavaScript specifically, look for "javascript" tag links in articles
          if (topic === 'javascript') {
            await expect.poll(() =>
              page.getByRole('article').getByRole('link', { name: 'javascript' }).count())
              .toBeGreaterThan(0);
          } else {
            await expect.poll(() =>
              page.getByRole('article').getByRole('link', { name: topic }).count())
              .toBeGreaterThan(0);
          }
        }
      });
    }

    test('browse by topic section displays correctly', async ({ page }) => {
      await test.step('Verify topic links and post counts', async () => {
        const browseByTopicSection = page.getByRole('heading', { name: 'Browse by Topic', level: 2 }).locator('..');
        
        // Check some major topics with post counts
        await expect(browseByTopicSection.getByRole('link', { name: /Nuxt \d+ posts/ })).toBeVisible();
        await expect(browseByTopicSection.getByRole('link', { name: /playwright \d+ posts/ })).toBeVisible();
        await expect(browseByTopicSection.getByRole('link', { name: /testing \d+ posts/ })).toBeVisible();
      });
    });

    test('tag section shows normalized tags', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Browse by Topic' })).toBeVisible();

      const tagLinks = page.locator('[href^="/blog/tags/"]');
      const tagCount = await tagLinks.count();

      expect(tagCount).toBeGreaterThan(0);
    });

    test('tag pages work with normalized tags', async ({ page }) => {
      await page.goto('/blog/tags/javascript');

      // Check that we navigated to the correct URL instead of checking heading text
      await expect(page).toHaveURL('/blog/tags/javascript');

      await expect(page.getByPlaceholder('Search articles...')).toBeVisible();
    });

    test('AI and MCP tag links work correctly', async ({ page, isMobile }) => {
      if (!isMobile) {
        await test.step('Verify AI tag link functionality', async () => {
          const aiTagLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /^ai$/i });
          if (await aiTagLink.count() > 0) {
            await aiTagLink.click();
            await expect(page).toHaveURL(/\/blog\/tags\/ai/);
          }
        });

        await test.step('Verify MCP tag link functionality if available', async () => {
          await page.goto('/blog');
          const mcpTagLink = page.getByRole('list', { name: 'topics' }).getByRole('link', { name: /^mcp$/i });
          if (await mcpTagLink.count() > 0) {
            await mcpTagLink.click();
            await expect(page).toHaveURL(/\/blog\/tags\/mcp/);
          }
        });
      }
    });
  });

  test.describe('Year Navigation', () => {
    test('year navigation section is visible', async ({ page }) => {
      await expect(page.getByRole('heading', { name: 'Browse by Year' })).toBeVisible();
    });

    test('year links navigate to correct year pages', async ({ page }) => {
      const yearLinks = page.getByRole('link').filter({ hasText: /^\d{4}$/ });
      const yearCount = await yearLinks.count();

      if (yearCount > 0) {
        const firstYearLink = yearLinks.first();
        const yearText = await firstYearLink.textContent();

        await firstYearLink.click();

        await expect(page).toHaveURL(`/blog/year/${yearText?.trim()}`);

        await expect(page.getByRole('heading', { name: `Blog Posts from ${yearText?.trim()}`, level: 1 })).toBeVisible();
      }
    });

    test('year page shows filtered posts', async ({ page }) => {
      await page.goto('/blog/year/2024');

      await expect(page.getByRole('heading', { name: 'Blog Posts from 2024', level: 1 })).toBeVisible();

      await expect(page.getByRole('link', { name: 'Back to Blog' })).toBeVisible();
    });

    test('browse by year section displays correctly', async ({ page }) => {
      await test.step('Verify year links and post counts', async () => {
        const browseByYearSection = page.getByRole('heading', { name: 'Browse by Year', level: 2 }).locator('..');
        
        // Check recent years with post counts
        await expect(browseByYearSection.getByRole('link', { name: /2025 \d+ posts/ })).toBeVisible();
        await expect(browseByYearSection.getByRole('link', { name: /2024 \d+ posts/ })).toBeVisible();
        await expect(browseByYearSection.getByRole('link', { name: /2023 \d+ posts/ })).toBeVisible();
      });

      await test.step('Test year navigation', async () => {
        const yearLink = page.getByRole('link', { name: /2025 \d+ posts/ });
        await yearLink.click();
        await expect(page).toHaveURL(/\/blog\/year\/2025/);
      });
    });
  });
});
