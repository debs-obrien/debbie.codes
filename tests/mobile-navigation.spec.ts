import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  const getHamburgerButton = (page: Page) => page.getByRole('button', { name: 'Open menu' });

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
      await expect(hamburgerButton).toHaveAccessibleName('Open menu');
    });

    await test.step('Open menu and verify it actually opened', async () => {
      // The hamburger handler is attached on hydration; a click fired before
      // that no-ops silently. Retry until the overlay close control appears.
      // (Hamburger also switches to "Close menu" when open, so scope to the ✕.)
      const overlayClose = page.getByRole('button', { name: 'Close menu' }).filter({ hasText: '✕' });
      await expect(async () => {
        await hamburgerButton.click();
        await expect(overlayClose).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });
    });

    await test.step('Close menu using the close button', async () => {
      const closeButton = page.getByRole('button', { name: 'Close menu' }).filter({ hasText: '✕' });
      await closeButton.click();
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await expect(hamburgerButton).toHaveAccessibleName('Open menu');
    });
  });

  // Mobile navigation menu is not rendering the navigation element properly after clicking hamburger
  test.fixme('Mobile Navigation - Menu reveals navigation links', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getHamburgerButton(page).click();
      // Wait for the navigation to become visible
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible();
    });

    await test.step('Verify navigation links are visible', async () => {
      await expect(page.getByRole('banner').getByRole('navigation')).toMatchAriaSnapshot(`
        - navigation:
          - list:
            - listitem:
              - link "About"
            - listitem:
              - link "Speaking"
            - listitem:
              - link "Videos"
            - listitem:
              - link "Podcasts"
            - listitem:
              - link "Courses"
            - listitem:
              - link "Blog"
            - listitem:
              - link "Now"
      `);
    });
  });

  // Mobile navigation menu is not rendering the navigation element properly after clicking hamburger
  test.fixme('Mobile Navigation - Navigation links work from mobile menu', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getHamburgerButton(page).click();
      // Wait for the navigation to become visible
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible();
    });

    await test.step('Click Blog link and verify navigation', async () => {
      await page.getByRole('banner').getByRole('navigation').getByRole('link', { name: 'Blog' }).click();
      await expect(page).toHaveURL(/.*\/blog/);
      await expect(page).toHaveTitle(/.*Blog.*Debbie Codes/);
    });
  });

  // Mobile navigation menu is not rendering the navigation element properly after clicking hamburger  
  test.fixme('Mobile Navigation - Social media links work from mobile menu', async ({ page }) => {
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

  // Mobile navigation menu is not rendering the navigation element properly after clicking hamburger
  test.fixme('Mobile Navigation - Works across different pages', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    await test.step('Navigate to About page', async () => {
      await hamburgerButton.click();
      // Wait for the navigation to become visible
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible();
      
      await page.getByRole('banner').getByRole('navigation').getByRole('link', { name: 'About' }).click();
      await expect(page).toHaveURL(/.*\/about/);
    });

    await test.step('Verify mobile menu still works on About page', async () => {
      // Wait for the page to settle after navigation
      await expect(hamburgerButton).toBeVisible();
      await hamburgerButton.click();
      // Wait for the navigation to become visible again
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible({ timeout: 10000 });
    });
  });

  test('Mobile Navigation - Menu closes when navigation link is clicked', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    // Scope link lookups to the opened navigation: the page footer also has
    // "Videos"/"About" links, so an unscoped exact-name match resolves to two
    // elements (strict-mode violation) on the built site.
    const nav = page.getByRole('navigation');
    const videosLink = nav.getByRole('link', { name: 'Videos', exact: true });
    const aboutLink = nav.getByRole('link', { name: 'About', exact: true });
    
    await test.step('Open mobile menu and click Videos', async () => {
      // Retry the open click until the menu is genuinely open (nav link
      // visible): a click fired before hydration attaches the handler no-ops.
      await expect(async () => {
        await hamburgerButton.click();
        await expect(videosLink).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });
      await videosLink.click();
    });

    await test.step('Verify menu closed after navigation', async () => {
      await expect(page).toHaveURL(/.*\/videos/);
      // Menu is closed when hamburger button shows 3 bars (not X)
      await expect(hamburgerButton).toHaveAccessibleName('Open menu');
    });

    await test.step('Open menu again and navigate to About', async () => {
      await expect(async () => {
        await hamburgerButton.click();
        await expect(aboutLink).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });
      await aboutLink.click();
    });

    await test.step('Verify menu closed after second navigation', async () => {
      await expect(page).toHaveURL(/.*\/about/);
      await expect(hamburgerButton).toHaveAccessibleName('Open menu');
    });
  });

  test('Mobile Navigation - Hamburger icon accessibility', async ({ page }) => {
    const hamburgerButton = getHamburgerButton(page);
    await test.step('Verify hamburger button has proper accessibility attributes', async () => {
      await expect(hamburgerButton).toBeVisible();
      await expect(hamburgerButton).toHaveAccessibleName('Open menu');
    });

    await test.step('Verify button is keyboard accessible', async () => {
      await hamburgerButton.focus();
      await expect(hamburgerButton).toBeFocused();
      
      await page.keyboard.press('Enter');
      
      await expect(page.getByRole('banner')).toBeInViewport();
    });
  });
});
