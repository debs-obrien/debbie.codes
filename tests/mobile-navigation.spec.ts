import { test, expect } from '@playwright/test';
import type { Page } from '@playwright/test';

test.describe('Mobile Navigation', () => {
  const getOpenMenuButton = (page: Page) => page.getByRole('button', { name: 'Open menu' });
  const getCloseMenuButton = (page: Page) => page.getByRole('button', { name: 'Close menu' });
  const getMenuDialog = (page: Page) => page.getByRole('dialog', { name: 'Menu' });

  async function openMobileMenu(page: Page) {
    const openMenu = getOpenMenuButton(page);
    const dialog = getMenuDialog(page);
    // The open handler is attached on hydration; a click fired before
    // that no-ops silently. Retry until the dialog is open. Skip clicking
    // when already open — the Open menu control is inert under showModal().
    await expect(async () => {
      if (!(await dialog.isVisible().catch(() => false))) {
        await openMenu.click();
      }
      await expect(dialog).toBeVisible({ timeout: 2000 });
    }).toPass({ timeout: 15000 });
  }

  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
  });

  test('Mobile Navigation - Hamburger menu button on mobile', async ({ page }) => {
    const openMenu = getOpenMenuButton(page);
    await test.step('Verify hamburger menu is visible on mobile', async () => {
      await expect(openMenu).toBeVisible();
    });

    await test.step('Verify mobile menu is initially closed', async () => {
      await expect(getMenuDialog(page)).toBeHidden();
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await expect(openMenu).toHaveAccessibleName('Open menu');
    });

    await test.step('Open menu and verify it actually opened', async () => {
      await openMobileMenu(page);
      await expect(getCloseMenuButton(page)).toBeVisible();
    });

    await test.step('Close menu using the close button', async () => {
      await getCloseMenuButton(page).click();
      await expect(getMenuDialog(page)).toBeHidden();
      await expect(page.getByRole('navigation')).not.toBeVisible();
      await expect(openMenu).toHaveAccessibleName('Open menu');
    });
  });

  test('Mobile Navigation - Only one Close menu control while open', async ({ page }) => {
    await openMobileMenu(page);

    await test.step('Dialog is exposed and Open menu stays labeled Open', async () => {
      await expect(getMenuDialog(page)).toBeVisible();
      await expect(getOpenMenuButton(page)).toHaveAccessibleName('Open menu');
      await expect(getOpenMenuButton(page)).toHaveAttribute('aria-expanded', 'true');
    });

    await test.step('Exactly one Close menu button', async () => {
      await expect(getCloseMenuButton(page)).toHaveCount(1);
      await expect(getCloseMenuButton(page)).toBeVisible();
    });
  });

  test('Mobile Navigation - Escape closes menu and restores focus to Open menu', async ({ page }) => {
    const openMenu = getOpenMenuButton(page);
    await openMobileMenu(page);

    await test.step('Focus is inside the dialog while open', async () => {
      await expect(getMenuDialog(page)).toBeVisible();
      // Native showModal() moves focus into the dialog (close button is first).
      await expect(getCloseMenuButton(page)).toBeFocused();
    });

    await test.step('Escape closes the dialog', async () => {
      await page.keyboard.press('Escape');
      await expect(getMenuDialog(page)).toBeHidden();
      await expect(getCloseMenuButton(page)).toHaveCount(0);
    });

    await test.step('Focus returns to Open menu', async () => {
      await expect(openMenu).toBeFocused();
      await expect(openMenu).toHaveAccessibleName('Open menu');
      await expect(openMenu).toHaveAttribute('aria-expanded', 'false');
    });
  });

  test('Mobile Navigation - Close button restores focus to Open menu', async ({ page }) => {
    const openMenu = getOpenMenuButton(page);
    await openMobileMenu(page);
    await getCloseMenuButton(page).click();
    await expect(getMenuDialog(page)).toBeHidden();
    await expect(openMenu).toBeFocused();
  });

  // Mobile navigation menu is not rendering the navigation element properly after clicking hamburger
  test.fixme('Mobile Navigation - Menu reveals navigation links', async ({ page }) => {
    await test.step('Open mobile menu', async () => {
      await getOpenMenuButton(page).click();
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
      await getOpenMenuButton(page).click();
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
      await getOpenMenuButton(page).click();
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
    const openMenu = getOpenMenuButton(page);
    await test.step('Navigate to About page', async () => {
      await openMenu.click();
      // Wait for the navigation to become visible
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible();
      
      await page.getByRole('banner').getByRole('navigation').getByRole('link', { name: 'About' }).click();
      await expect(page).toHaveURL(/.*\/about/);
    });

    await test.step('Verify mobile menu still works on About page', async () => {
      // Wait for the page to settle after navigation
      await expect(openMenu).toBeVisible();
      await openMenu.click();
      // Wait for the navigation to become visible again
      await expect(page.getByRole('banner').getByRole('navigation')).toBeVisible({ timeout: 10000 });
    });
  });

  test('Mobile Navigation - Menu closes when navigation link is clicked', async ({ page }) => {
    const openMenu = getOpenMenuButton(page);
    // Scope link lookups to the dialog: the page footer also has
    // "Videos"/"About" links, so an unscoped exact-name match resolves to two
    // elements (strict-mode violation) on the built site.
    const dialog = getMenuDialog(page);
    const videosLink = dialog.getByRole('link', { name: 'Videos', exact: true });
    const aboutLink = dialog.getByRole('link', { name: 'About', exact: true });
    
    await test.step('Open mobile menu and click Videos', async () => {
      await openMobileMenu(page);
      await videosLink.click();
    });

    await test.step('Verify menu closed after navigation', async () => {
      await expect(page).toHaveURL(/.*\/videos/);
      await expect(dialog).toBeHidden();
      await expect(openMenu).toHaveAccessibleName('Open menu');
    });

    await test.step('Open menu again and navigate to About', async () => {
      await openMobileMenu(page);
      await aboutLink.click();
    });

    await test.step('Verify menu closed after second navigation', async () => {
      await expect(page).toHaveURL(/.*\/about/);
      await expect(dialog).toBeHidden();
      await expect(openMenu).toHaveAccessibleName('Open menu');
    });
  });

  test('Mobile Navigation - Hamburger icon accessibility', async ({ page }) => {
    const openMenu = getOpenMenuButton(page);
    await test.step('Verify hamburger button has proper accessibility attributes', async () => {
      await expect(openMenu).toBeVisible();
      await expect(openMenu).toHaveAccessibleName('Open menu');
      await expect(openMenu).toHaveAttribute('aria-haspopup', 'dialog');
    });

    await test.step('Verify button is keyboard accessible', async () => {
      // Retry Enter until hydration attaches the open handler (same race as click).
      await expect(async () => {
        await openMenu.focus();
        await expect(openMenu).toBeFocused();
        await page.keyboard.press('Enter');
        await expect(getMenuDialog(page)).toBeVisible({ timeout: 2000 });
      }).toPass({ timeout: 15000 });
      await expect(getCloseMenuButton(page)).toBeFocused();
    });
  });
});
