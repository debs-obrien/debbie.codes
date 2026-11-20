import { expect, test } from './fixtures';

test.describe('Footer utility links', () => {
  test('exposes Contact, Privacy, and RSS with correct hrefs and type', async ({ page }) => {
    await page.goto('/');

    const footer = page.getByRole('contentinfo');
    const utilityNav = footer.getByRole('navigation', { name: 'Utility links' });

    const contact = utilityNav.getByRole('link', { name: 'Contact' });
    await expect(contact).toHaveAttribute('href', '/contact');

    const privacy = utilityNav.getByRole('link', { name: 'Privacy' });
    await expect(privacy).toHaveAttribute('href', '/privacy');

    const rss = utilityNav.getByRole('link', { name: 'RSS' });
    await expect(rss).toHaveAttribute('href', '/feed.xml');
    await expect(rss).toHaveAttribute('type', 'application/rss+xml');
  });
});
