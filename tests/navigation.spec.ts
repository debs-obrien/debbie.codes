import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('logo links to home page', async ({ page }) => {
  await page.getByRole('link', { name: 'Debbie O\'Brien Debbie O\'Brien' }).click();
  await expect(page).toHaveURL('/');
});

const routes = ['about', 'videos', 'podcasts', 'blog', 'courses']

test.describe('main navigation', () => {

  test.beforeEach(async ({ page, isMobile }) => {

    if(isMobile){
      await page.getByRole('button', { name: 'open menu' }).click();
    }
  });


  for (const route of routes) {
    test(`menu links to ${route}`, async ({ page }) => {
      await page.getByRole('navigation').getByRole('link', { name: route }).click();
      await expect(page).toHaveURL(route);
      await page.goto(`/${route}`);

    })
  }

})

test.describe('footer navigation', () => {

  for (const route of routes) {
    test(`footer menu links to ${route}`, async ({ page }) => {
      await page.getByRole('contentinfo').getByRole('link', { name: route }).click();
      await expect(page).toHaveURL(route);
      await page.goto(`/${route}`);
      })
    }
})
