import { expect, test } from '@playwright/test';

const LINKEDIN = 'https://www.linkedin.com/in/debbie-obrien';

test.describe('Contact page', () => {
  test('renders hiring-first layout with LinkedIn CTA and no email', async ({ page }) => {
    await page.goto('/contact');

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
    await page.goto('/contact');
    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-error-summary')).toBeVisible();
    await expect(page.getByText('Please add your name.')).toBeVisible();
    await expect(page.getByText('Please pick what it\'s about.')).toBeVisible();
    await expect(page.getByText('Please write a short message.')).toBeVisible();
  });

  test('maxlength holds on name and message', async ({ page }) => {
    await page.goto('/contact');
    const name = page.getByTestId('contact-name');
    const message = page.getByTestId('contact-message');
    await expect(name).toHaveAttribute('maxlength', '80');
    await expect(message).toHaveAttribute('maxlength', '1000');
  });

  test('honeypot field exists and filled honeypot is rejected', async ({ page }) => {
    await page.goto('/contact');

    const honeypot = page.getByTestId('contact-honeypot');
    await expect(honeypot).toHaveCount(1);
    await expect(honeypot).toBeHidden();

    // Wait for challenge token from the API.
    await expect.poll(async () => {
      return page.locator('input[name="challenge"]').inputValue();
    }).not.toBe('');

    await page.getByTestId('contact-name').fill('Alex Rivera');
    await page.getByTestId('contact-email').fill('alex@company.com');
    await page.getByTestId('contact-reason').selectOption('other');
    await page.getByTestId('contact-message').fill('QA test from engineer bot, please ignore this honeypot case.');

    // Fill honeypot via DOM (hidden from users).
    await honeypot.fill('https://spam.example');

    // Enforce min submit time locally by advancing challenge age isn't
    // possible without the secret; wait 3s so timing doesn't mask honeypot.
    await page.waitForTimeout(3100);

    await page.getByTestId('contact-submit').click();
    await expect(page.getByTestId('contact-rate-limit')).toBeVisible({ timeout: 10000 });
  });
});
