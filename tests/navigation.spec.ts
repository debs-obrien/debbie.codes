import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('logo links to home page', async ({ page }) => {
  await page.getByRole('link', { name: 'Debbie O\'Brien Debbie O\'Brien' }).click();
  await expect(page).toHaveURL('/');
});

const links = ['about', 'videos', 'podcasts', 'blog', 'courses']

test.describe('main navigation', () => {

  test.beforeEach(async ({ page, isMobile }) => {

    if(isMobile){
      await page.getByRole('button', { name: 'open menu' }).click();
    }
  });


  for (const link of links) {
    test(`menu links to ${link}`, async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: link }).click();
      await expect(page).toHaveURL(link);
    })
  }

})

test.describe('footer navigation', () => {

  for (const link of links) {
    test(`footer menu links to ${link}`, async ({ page }) => {
        await page.getByRole('contentinfo').getByRole('link', { name: link }).click();
        await expect(page).toHaveURL(link);
      })
    }
})
