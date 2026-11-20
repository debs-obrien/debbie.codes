import { expect, test } from './fixtures';

test.describe('performance and accessibility guards', () => {
  test('canonical no-slash URLs are served without a redirect', async ({ request }) => {
    for (const path of ['/blog', '/videos', '/blog/grok-bot-explained']) {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), path).toBe(200);
    }
  });

  test('top-bar photo is decorative so the link name is not repeated', async ({ page }) => {
    await page.goto('/blog');
    await expect(page.getByRole('banner').locator('img.profile-pic')).toHaveAttribute('alt', '');
    await expect(page.getByRole('banner').getByRole('link', { name: 'Debbie O\'Brien', exact: true })).toBeVisible();
  });

  test('post dates and prev/next links meet contrast and label-in-name', async ({ page }) => {
    await page.goto('/blog/grok-bot-explained');
    // text-gray-600 in light mode: 4.5:1+ on the page background
    await expect(page.locator('article header time').first()).toHaveCSS('color', 'rgb(75, 85, 99)');
    const prevNext = page.getByRole('navigation', { name: 'Blog post navigation' }).getByRole('link');
    await expect(prevNext.first()).not.toHaveAttribute('aria-label', /.*/);
    await expect(page.getByRole('link', { name: /^(Previous|Next) post: / }).first()).toBeVisible();
  });

  test('code block token colours meet WCAG AA contrast in light and dark', async ({ page }) => {
    const posts = ['/blog/webmcp-on-my-site', '/blog/offline-ai-study-app-local-models-lfm3'];
    for (const scheme of ['light', 'dark'] as const) {
      await page.emulateMedia({ colorScheme: scheme });
      for (const path of posts) {
        await page.goto(path);
        await page.evaluate((mode) => {
          document.documentElement.classList.remove('light', 'dark');
          document.documentElement.classList.add(mode);
          localStorage.setItem('nuxt-color-mode', mode);
        }, scheme);

        const scan = await page.evaluate(() => {
          function lum(cssColor: string): number {
            const rgb = cssColor.match(/^rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
            if (!rgb)
              return 0;
            const r = Number(rgb[1]) / 255;
            const g = Number(rgb[2]) / 255;
            const b = Number(rgb[3]) / 255;
            const toLinear = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
            return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
          }
          function ratio(fg: string, bg: string): number {
            const L1 = lum(fg);
            const L2 = lum(bg);
            const lighter = Math.max(L1, L2);
            const darker = Math.min(L1, L2);
            return (lighter + 0.05) / (darker + 0.05);
          }
          function effectiveBg(el: Element): string {
            let p: Element | null = el;
            while (p) {
              const bg = getComputedStyle(p).backgroundColor;
              if (bg && bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent')
                return bg;
              p = p.parentElement;
            }
            return 'rgb(255, 255, 255)';
          }

          const failures: { text: string, fg: string, bg: string, ratio: number }[] = [];
          let tokenCount = 0;
          // Token spans carry hashed Shiki classes; `.line` wrappers are skipped.
          for (const span of document.querySelectorAll<HTMLElement>('pre.shiki span:not(.line)')) {
            const text = span.textContent ?? '';
            if (!text.trim())
              continue;
            tokenCount += 1;
            const fg = getComputedStyle(span).color;
            const bg = effectiveBg(span);
            const r = ratio(fg, bg);
            if (r < 4.5)
              failures.push({ text: text.slice(0, 24), fg, bg, ratio: Number(r.toFixed(2)) });
          }
          return { tokenCount, failures };
        });

        expect(scan.tokenCount, `${path} (${scheme}) should have highlighted tokens`).toBeGreaterThan(0);
        expect(scan.failures, `${path} (${scheme})`).toEqual([]);
      }
    }
  });

  test('blog lead cover loads eagerly with high priority, later covers stay lazy', async ({ page }) => {
    await page.goto('/blog');
    const covers = page.getByTestId('blog-card-cover').locator('img');
    const lead = covers.first();
    await expect(lead).not.toHaveAttribute('loading', 'lazy');
    await expect(lead).toHaveAttribute('fetchpriority', 'high');
    // Only the lead is LCP; compact covers below the fold stay lazy.
    await expect(covers.nth(1)).toHaveAttribute('loading', 'lazy');
    await expect(covers.nth(1)).not.toHaveAttribute('fetchpriority', 'high');
    await expect(covers.nth(3)).toHaveAttribute('loading', 'lazy');
    // The lead cover's link duplicates the title link, so it stays out of the a11y tree and tab order.
    const leadCoverLink = page.getByTestId('blog-card-cover').first().locator('a');
    await expect(leadCoverLink).toHaveAttribute('aria-hidden', 'true');
    await expect(leadCoverLink).toHaveAttribute('tabindex', '-1');
  });

  test('home featured YouTube thumb is the sole high-priority image; blog covers stay lazy', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');
    const high = page.locator('img[fetchpriority="high"]');
    await expect(high).toHaveCount(1);
    const yt = high.first();
    await expect(yt).toHaveAttribute('src', /ytimg\.com/);
    await expect(yt).not.toHaveAttribute('loading', 'lazy');
    const covers = page.getByTestId('blog-card-cover').locator('img');
    await expect(covers.first()).toHaveAttribute('loading', 'lazy');
    await expect(covers.first()).not.toHaveAttribute('fetchpriority', 'high');

    // Mobile: still only one high-priority image.
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await expect(page.locator('img[fetchpriority="high"]')).toHaveCount(1);
  });
});
