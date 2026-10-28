import { expect, test } from '@playwright/test';

const LINKEDIN = 'https://www.linkedin.com/in/debbie-obrien';

async function waitForContactForm(page: import('@playwright/test').Page) {
  await page.goto('/contact');
  await expect(page.getByTestId('contact-form')).toBeVisible();
  // Challenge token means the client handler + API are ready (hydration done).
  await expect.poll(async () => {
    return page.locator('input[name="challenge"]').inputValue();
  }).not.toBe('');
}

test.describe('Contact page', () => {
  test('renders hiring-first layout with LinkedIn CTA and no email', async ({ page }) => {
    await waitForContactForm(page);

    await expect(page).toHaveURL(/\/contact\/?$/);
    await expect(page).toHaveTitle(/Contact/);
    await expect(page.getByRole('heading', { name: 'Hiring? Let\'s talk.', level: 1 })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Send me a message', level: 2 })).toBeVisible();

    const linkedIn = page.getByTestId('contact-linkedin-cta');
    await expect(linkedIn).toHaveAttribute('href', LINKEDIN);

    const html = await page.content();
    expect(html).not.toMatch(/mailto:/i);
    expect(html).not.toMatch(/dobriendev@gmail\.com/i);
    expect(html).not.toMatch(/@gmail\.com/i);

    // Bundle / page must not expose a personal email string.
    const scripts = await page.locator('script[src]').evaluateAll(async (els) => {
      const texts: string[] = [];
      for (const el of els) {
        const src = (el as HTMLScriptElement).src;
        if (!src || src.includes('cloudflare') || src.includes('elevenlabs'))
          continue;
        try {
          const res = await fetch(src);
          if (res.ok)
            texts.push(await res.text());
        }
        catch {
          // ignore
        }
      }
      return texts.join('\n');
    });
    expect(scripts).not.toMatch(/dobriendev@gmail\.com/i);
  });

  test('preselects hiring from ?reason=hiring', async ({ page }) => {
    await page.goto('/contact?reason=hiring');
    await expect(page.getByTestId('contact-reason')).toHaveValue('hiring');
    await expect(page.getByTestId('contact-preselect-note')).toBeVisible();
  });

  test('client validation blocks empty submit', async ({ page }) => {
    await waitForContactForm(page);
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-error-summary')).toBeVisible();
    await expect(page.getByText('Please add your name.')).toBeVisible();
    await expect(page.getByText('Please pick what it\'s about.')).toBeVisible();
    await expect(page.getByText('Please write a short message.')).toBeVisible();
  });

  test('maxlength holds on name and message', async ({ page }) => {
    await waitForContactForm(page);
    const name = page.getByTestId('contact-name');
    const message = page.getByTestId('contact-message');
    await expect(name).toHaveAttribute('maxlength', '80');
    await expect(message).toHaveAttribute('maxlength', '1000');
  });

  test('honeypot field exists and filled honeypot is rejected', async ({ page }) => {
    await waitForContactForm(page);

    const honeypot = page.getByTestId('contact-honeypot');
    await expect(honeypot).toHaveCount(1);
    // Assert exclusion from a11y/tab order rather than layout visibility —
    // clipped/sr-only fields can still report as "visible" to Playwright.
    await expect(honeypot).toHaveAttribute('tabindex', '-1');
    await expect(honeypot).toHaveAttribute('autocomplete', 'off');
    const wrapper = page.locator('.contact-honeypot');
    await expect(wrapper).toHaveAttribute('aria-hidden', 'true');
    await expect(wrapper).toHaveAttribute('hidden', '');

    await page.getByTestId('contact-name').fill('Alex Rivera');
    await page.getByTestId('contact-email').fill('alex@company.com');
    await page.getByTestId('contact-reason').selectOption('other');
    await page.getByTestId('contact-message').fill('QA test from engineer bot, please ignore this honeypot case.');

    // Fill honeypot via DOM so Vue v-model updates (field is [hidden]).
    await honeypot.evaluate((el) => {
      const input = el as HTMLInputElement;
      input.value = 'https://spam.example';
      input.dispatchEvent(new Event('input', { bubbles: true }));
    });

    // Enforce min submit time so timing doesn't mask the honeypot rejection.
    await page.waitForTimeout(3100);

    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-rate-limit')).toBeVisible({ timeout: 10000 });
  });
});
