import { expect, test } from '@playwright/test';
import { GITHUB_URL, LINKEDIN_URL, PUBLIC_MAILTO, X_URL } from '../utils/site-contact';

test('contact page links to LinkedIn, X, GitHub, hire-me and email', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByTestId('contact-page')).toBeVisible();

  await expect(page.getByTestId('contact-linkedin-cta')).toHaveAttribute('href', LINKEDIN_URL);
  await expect(page.getByTestId('contact-x-cta')).toHaveAttribute('href', X_URL);
  await expect(page.getByTestId('contact-github-cta')).toHaveAttribute('href', GITHUB_URL);
  await expect(page.getByTestId('contact-hire-me-link')).toHaveAttribute('href', '/hire-me');
  await expect(page.getByTestId('contact-email-link')).toHaveAttribute('href', PUBLIC_MAILTO);
});
