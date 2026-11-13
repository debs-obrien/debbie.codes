import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { expect, test } from './fixtures';

function yearsWithPublishedPosts(): string[] {
  const dir = join(process.cwd(), 'content/blog');
  const years = new Set<string>();
  for (const file of readdirSync(dir).filter(name => name.endsWith('.md'))) {
    const raw = readFileSync(join(dir, file), 'utf8');
    if (/^published:\s*false\s*$/m.test(raw))
      continue;
    const match = raw.match(/^date:\s*['"]?(\d{4})/m);
    if (match)
      years.add(match[1]);
  }
  return [...years].sort();
}

async function collectLinkedYearHrefs(page: import('@playwright/test').Page): Promise<string[]> {
  const yearHrefs = new Set<string>();
  for (const path of ['/blog', '/blog/page/1']) {
    await page.goto(path);
    const hrefs = await page.locator('a[href^="/blog/year/"]').evaluateAll(anchors =>
      anchors
        .map(a => a.getAttribute('href'))
        .filter((href): href is string => !!href && /^\/blog\/year\/\d{4}\/?$/.test(href))
    );
    for (const href of hrefs)
      yearHrefs.add(href.replace(/\/$/, ''));
  }
  return [...yearHrefs].sort();
}

test.describe('Blog Year Navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog');
  });

  test('year navigation section is visible', async ({ page }) => {
    // Year links should be visible in the filter section
    await expect(page.getByRole('link', { name: '2024' })).toBeVisible();
    await expect(page.getByRole('link', { name: '2025' })).toBeVisible();
  });

  test('year links navigate to correct year pages', async ({ page }) => {
    const yearLinks = page.getByRole('link').filter({ hasText: /^\d{4}$/ });
    const yearCount = await yearLinks.count();

    if (yearCount > 0) {
      const firstYearLink = yearLinks.first();
      const yearText = await firstYearLink.textContent();

      // Retry the click until navigation happens. On a cold page load (fresh
      // Endform runner) a click can fire before Nuxt hydration attaches the SPA
      // router, silently leaving us on /blog.
      await expect(async () => {
        await firstYearLink.click();
        await expect(page).toHaveURL(new RegExp(`/blog/year/${yearText?.trim()}/?$`), { timeout: 2000 });
      }).toPass({ timeout: 15000 });

      await expect(page.getByRole('heading', { name: yearText?.trim(), level: 1 })).toBeVisible();
    }
  });

  test('year page shows filtered posts', async ({ page }) => {
    await page.goto('/blog/year/2024');

    await expect(page.getByRole('heading', { name: '2024', level: 1 })).toBeVisible();

    // Verify that articles are shown for the year. Poll rather than a one-shot
    // count(): on a cold load articles hydrate progressively, so an immediate
    // read can catch an empty list.
    await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
  });

  test('every year linked from blog pages returns 200 and lists posts', async ({ page, request }) => {
    const linked = await collectLinkedYearHrefs(page);
    expect(linked.length, 'expected at least one year link on blog pages').toBeGreaterThan(0);

    // UI chips must resolve; also every content year (e.g. 2021/2022) must exist
    // even when the recent-years strip does not link it.
    const contentYears = yearsWithPublishedPosts().map(year => `/blog/year/${year}`);
    const hrefs = [...new Set([...linked, ...contentYears])].sort();

    for (const href of linked)
      expect(contentYears, `${href} linked in UI but has no published posts`).toContain(href);

    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), href).toBe(200);

      await page.goto(href);
      const year = href.split('/').pop()!;
      await expect(page.getByRole('heading', { name: year, level: 1 })).toBeVisible();
      await expect.poll(() => page.getByRole('article').count(), { timeout: 15000 }).toBeGreaterThan(0);
    }
  });
});
