import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  const getHamburgerButton = (page: Page) => page.getByRole('button', { name: 'open menu' });

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('Mobile Navigation - Hamburger menu button on mobile', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    await test.step('Verify hamburger menu is visible on mobile', async () => {
      await expect(hamburgerButton).toBeVisible();
    });

    await test.step('Verify mobile menu is initially closed', async () => {
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await expect(hamburgerButton).toHaveAccessibleName('open menu');
    });

    await test.step('Open menu and verify state change', async () => {
      await hamburgerButton.click();
      await expect(page.getByRole('banner')).toBeInViewport();
    });

    await test.step('Close menu by clicking button again', async () => {
      await hamburgerButton.click();
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await expect(hamburgerButton).toHaveAccessibleName('open menu');
    });
  });

  test('Mobile Navigation - Menu reveals navigation links', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getHamburgerButton(page).click();
    });

    await test.step('Verify navigation links are visible', async () => {
      await expect(page.getByRole('navigation')).toMatchAriaSnapshot(`
        - navigation:
          - list:
            - listitem:
              - link "About"
            - listitem:
              - link "Videos"
            - listitem:
              - link "Podcasts"
            - listitem:
              - link "Courses"
            - listitem:
              - link "Blog"
      `);
    });

    await test.step('Verify hamburger button shows close indicator', async () => {
      await expect(getHamburgerButton(page).getByText('X')).toBeVisible();
    });
  });

  test('Mobile Navigation - Navigation links work from mobile menu', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getHamburgerButton(page).click();
    });

    await test.step('Click Blog link and verify navigation', async () => {
      await page.getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
      await expect(page).toHaveURL(/.*\/blog/);
      await expect(page).toHaveTitle(/.*Blog.*Debbie Codes/);
    });
  });

  test('Mobile Navigation - Social media links work from mobile menu', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getHamburgerButton(page).click();
    });

    await test.step('Verify social media links are present', async () => {
      const socialLinksContainer = page.getByRole('banner').getByRole('list').filter({ has: page.getByRole('link', { name: 'x' }) });
      await expect(socialLinksContainer).toMatchAriaSnapshot(`
        - list:
          - listitem:
            - link "x":
              - /url: https://x.com/debs_obrien
              - img
          - listitem:
            - link "linkedIn":
              - /url: https://www.linkedin.com/in/debbie-o-brien-1a199975/
              - img
          - listitem:
            - link "github":
              - /url: https://github.com/debs-obrien
          - listitem:
            - link "youtube":
              - /url: https://www.youtube.com/c/DebbieOBrien
              - img
      `);
    });
  });

  test('Mobile Navigation - Works across different pages', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    await test.step('Navigate to About page', async () => {
      await hamburgerButton.click();
      await page.getByRole('navigation').getByRole('link', { name: 'About' }).click();
      await expect(page).toHaveURL(/.*\/about/);
    });

    await test.step('Verify mobile menu still works on About page', async () => {
      await expect(hamburgerButton).toBeVisible();
      await hamburgerButton.click();
      
      await expect(page.getByRole('banner')).toBeInViewport();
    });
  });

  test('Mobile Navigation - Hamburger icon accessibility', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    await test.step('Verify hamburger button has proper accessibility attributes', async () => {
      await expect(hamburgerButton).toBeVisible();
      await expect(hamburgerButton).toHaveAccessibleName('open menu');
    });

    await test.step('Verify button is keyboard accessible', async () => {
      await hamburgerButton.focus();
      await expect(hamburgerButton).toBeFocused();
      
      await page.keyboard.press('Enter');
      
      await expect(page.getByRole('banner')).toBeInViewport();
    });
  });
});
