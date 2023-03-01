import { expect, test } from '@playwright/test';

test.use({ colorScheme: 'dark' });

test('test color mode', async ({ page, isMobile }) => {
  await page.goto('/');

  const hamburger = page.getByRole('button', { name: 'open menu' });

  if(isMobile){
    await hamburger.click();
  }

  await page.getByRole('button', { name: 'system' }).click();
  await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');

  if(isMobile){
    await hamburger.click();
  }

  await page.getByRole('button', { name: 'dark' }).click();
  await expect(page.getByRole('document')).toHaveAttribute('class', 'light');

  if(isMobile){
    await hamburger.click();
  }

  await page.getByRole('button', { name: 'light' }).click();
  await expect(page.getByRole('document')).toHaveAttribute('class', 'dark');
});
