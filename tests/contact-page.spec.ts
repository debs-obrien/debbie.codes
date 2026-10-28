import { expect, test } from '@playwright/test';

const LINKEDIN = 'https://www.linkedin.com/in/debbie-obrien';
const X = 'https://x.com/debs_obrien';
const GITHUB = 'https://github.com/debs-obrien';

test('contact page links to LinkedIn, X, GitHub and hire-me with no mailto', async ({ page }) => {
  await page.goto('/contact');
  await expect(page.getByTestId('contact-page')).toBeVisible();

  await expect(page.getByTestId('contact-linkedin-cta')).toHaveAttribute('href', LINKEDIN);
  await expect(page.getByTestId('contact-x-cta')).toHaveAttribute('href', X);
  await expect(page.getByTestId('contact-github-cta')).toHaveAttribute('href', GITHUB);
  await expect(page.getByTestId('contact-hire-me-link')).toHaveAttribute('href', '/hire-me');

  const html = await page.content();
  expect(html).not.toMatch(/mailto:/i);
  expect(html).not.toMatch(/dobriendev@gmail\.com/i);
});
