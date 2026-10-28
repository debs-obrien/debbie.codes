import { expect, test } from './fixtures';

/**
 * Blog posts must expose machine-readable Article metadata:
 * - schema.org JSON-LD (Article + Person author)
 * - valid <time datetime="YYYY-MM-DD">
 * - og:type=article
 */
test.describe('Blog article structured data', () => {
  test('emits Article JSON-LD, ISO datetime, and og:type=article', async ({ page }) => {
    await page.goto('/blog/testing-color-mode');

    await expect(
      page.getByRole('heading', { name: 'Testing a Sites Color Mode with Playwright' })
    ).toBeVisible();

    // Visible date still human-readable
    await expect(page.getByText('September 3, 2022')).toBeVisible();

    // <time datetime> must be a calendar date, not the formatted label
    const time = page.locator('article header time').first();
    await expect(time).toHaveAttribute('datetime', '2022-09-03');

    const jsonLd = await page.locator('script[type="application/ld+json"]').evaluateAll((nodes) => {
      return nodes
        .map((node) => {
          try {
            return JSON.parse(node.textContent || '');
          }
          catch {
            return null;
          }
        })
        .filter(Boolean);
    });

    const article = jsonLd.find((entry: { '@type'?: string }) => entry?.['@type'] === 'Article');
    expect(article, 'expected an Article JSON-LD block').toBeTruthy();
    expect(article).toMatchObject({
      '@context': 'https://schema.org',
      '@type': 'Article',
      'headline': 'Testing a Sites Color Mode with Playwright',
      'datePublished': '2022-09-03',
      'url': 'https://debbie.codes/blog/testing-color-mode',
      'author': {
        '@type': 'Person',
        'name': 'Debbie O\'Brien',
        'url': 'https://debbie.codes/about'
      }
    });
    expect(article.image?.[0]).toMatch(/^https:\/\//);
    expect(article.timeRequired).toMatch(/^PT\d+M$/);

    // Open Graph type should match Article semantics
    await expect(page.locator('meta[property="og:type"]')).toHaveAttribute('content', 'article');
  });
});
