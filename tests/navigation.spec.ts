import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('logo links to home page', async ({ page }) => {
  await page.getByRole('link', { name: 'Debbie O\'Brien Debbie O\'Brien' }).click();
  await expect(page).toHaveURL('/');
});


test.describe('navigation', () => {

  const links = ['about', 'videos', 'podcasts', 'blog', 'courses']

  test(`header nav links to correct pages`, async ({ page, isMobile }) => {
    for (const link of links) {
      if(isMobile){
        await page.getByRole('button', { name: 'open menu' }).click();
      }
        await page.getByRole('navigation').getByRole('link', { name: link }).click();
        await expect(page).toHaveURL(link);
    }
  })

  test(`footer nav links to correct pages`, async ({ page }) => {
    for (const link of links) {
      await page.getByRole('contentinfo').getByRole('link', { name: link }).click();
      await expect(page).toHaveURL(link);
    }
  })
})
