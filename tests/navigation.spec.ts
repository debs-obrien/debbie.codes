import { expect, test } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/');
});

test('logo links to home page', async ({ page }) => {
  await page.getByRole('link', { name: 'Debbie O\'Brien Debbie O\'Brien' }).click();
  await expect(page).toHaveURL('/');
});


test.describe('navigation', () => {

  test(`header nav links to correct pages`, async ({ page, isMobile }) => {

    const hamburgerMenu = page.getByRole('button', { name: 'open menu' });

    if (isMobile) {
      await hamburgerMenu.click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'about' }).click();
    await expect(page).toHaveURL('about');
      
    if (isMobile) {
      await hamburgerMenu.click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'videos' }).click();
    await expect(page).toHaveURL('videos');
      
    if (isMobile) {
      await hamburgerMenu.click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'podcasts' }).click();
    await expect(page).toHaveURL('podcasts');
      
    if (isMobile) {
      await hamburgerMenu.click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'courses' }).click();
    await expect(page).toHaveURL('courses');
      
    if (isMobile) {
      await hamburgerMenu.click();
    }
    await page.getByRole('navigation').getByRole('link', { name: 'blog' }).click();
    await expect(page).toHaveURL('blog');

  })

  test(`footer nav links to correct pages`, async ({ page, isMobile }) => {
    test.skip(isMobile, 'Still working on it');
      await page.getByRole('contentinfo').getByRole('link', { name: 'about' }).click();
      await expect(page).toHaveURL('about');

      await page.getByRole('contentinfo').getByRole('link', { name: 'videos' }).click();
      await expect(page).toHaveURL('videos');
        
      await page.getByRole('contentinfo').getByRole('link', { name: 'podcasts' }).click();
      await expect(page).toHaveURL('podcasts');
        
      await page.getByRole('contentinfo').getByRole('link', { name: 'courses' }).click();
      await expect(page).toHaveURL('courses');
        
      await page.getByRole('contentinfo').getByRole('link', { name: 'blog' }).click();
      await expect(page).toHaveURL('blog');
    })
})
