import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'dark' });

test('test system color mode', async ({ page, isMobile }) => {
  await page.goto('/');

  // Wait for hydration to complete before interacting
  await page.waitForLoadState('networkidle');

  const hamburger = page.getByRole('button', { name: 'open menu' });

  // Initial state: preference is 'system', which resolves to 'dark' based on test.use({ colorScheme: 'dark' })
  // Button should show 'system'
  await test.step('Initial state verification', async () => {
    const systemButton = isMobile 
      ? page.getByRole('button', { name: 'system' }).nth(1)
      : page.getByRole('button', { name: 'system' }).first();
    await expect(systemButton).toBeVisible();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');
  });

  await test.step('Click to cycle from system to dark mode', async () => {
    if (isMobile) {
      await hamburger.click();
    }

    const systemButton = isMobile 
      ? page.getByRole('button', { name: 'system' }).nth(1)
      : page.getByRole('button', { name: 'system' }).first();
    await systemButton.click();
    
    // After clicking, should cycle to explicit 'dark' mode - wait for aria-label to change
    const darkButton = isMobile 
      ? page.getByRole('button', { name: 'dark' }).nth(1)
      : page.getByRole('button', { name: 'dark' }).first();
    await expect(darkButton).toBeVisible();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');

    if (isMobile) {
      await hamburger.click();
    }
  });

  await test.step('Click to cycle from dark to light mode', async () => {
    if (isMobile) {
      await hamburger.click();
    }

    const darkButton = isMobile 
      ? page.getByRole('button', { name: 'dark' }).nth(1)
      : page.getByRole('button', { name: 'dark' }).first();
    await darkButton.click();
    
    // After clicking, should cycle to 'light' mode - wait for aria-label to change
    const lightButton = isMobile 
      ? page.getByRole('button', { name: 'light' }).nth(1)
      : page.getByRole('button', { name: 'light' }).first();
    await expect(lightButton).toBeVisible();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'light');

    if (isMobile) {
      await hamburger.click();
    }
  });

  await test.step('Click to cycle from light back to system mode', async () => {
    if (isMobile) {
      await hamburger.click();
    }

    const lightButton = isMobile 
      ? page.getByRole('button', { name: 'light' }).nth(1)
      : page.getByRole('button', { name: 'light' }).first();
    await lightButton.click();
    
    // After clicking, should cycle back to 'system', which resolves to 'dark' due to test config
    const systemButton = isMobile 
      ? page.getByRole('button', { name: 'system' }).nth(1)
      : page.getByRole('button', { name: 'system' }).first();
    await expect(systemButton).toBeVisible();
    await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');

    if (isMobile) {
      await hamburger.click();
    }
  });
});
