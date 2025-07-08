import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('displays correct page title and main content', async ({ page }) => {
    await expect(page).toHaveTitle(/About Debbie and her experience as a developer/);
    
    await expect(page.getByText('Hello There!')).toBeVisible();
    await expect(page.getByRole('heading', { name: "I'm Debbie O'Brien" })).toBeVisible();
    
    await expect(page.getByText('With over 15 years experience in Frontend development')).toBeVisible();
    await expect(page.getByText('I am a Principal Technical Program manager at Microsoft')).toBeVisible();
    await expect(page.getByText('I have a special love for JavaScript frameworks')).toBeVisible();
    await expect(page.getByText('I am Irish but live in Mallorca, Spain')).toBeVisible();
  });

  test('displays Awards and Achievements section', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Awards & Achievements' })).toBeVisible();
    
    await expect(page.getByRole('heading', { name: 'GitHub Star Alumni' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Google Developer Expert' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Former Microsoft Most Valuable Professional' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Media Developer Expert' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Auth0 Ambassador' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Microsoft Certified' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Bachelor\'s Level Diploma' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Full Stack JavaScript Tech Degree' })).toBeVisible();
  });

  test('external links in bio section work correctly', async ({ page }) => {
    const vueSchoolLink = page.getByRole('link', { name: 'Vue School' });
    await expect(vueSchoolLink).toHaveAttribute('href', 'https://vueschool.io/courses/internationalization-with-vue-i18n');
    
    const jamstackLink = page.getByRole('link', { name: 'Jamstack Explorers' });
    await expect(jamstackLink).toHaveAttribute('href', 'https://explorers.netlify.com/learn/get-started-with-nuxt');
    
    const ultimateCoursesLink = page.getByRole('link', { name: 'Ultimate Courses' });
    await expect(ultimateCoursesLink).toHaveAttribute('href', 'https://ultimatecourses.com/author/debbieobrien');
    
    const youtubeLink = page.getByRole('link', { name: 'YouTube Channel' });
    await expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');
  });

  test('award links are functional and point to correct URLs', async ({ page }) => {
    const githubStarLink = page.getByRole('heading', { name: 'GitHub Star Alumni' }).getByRole('link');
    await expect(githubStarLink).toHaveAttribute('href', 'https://stars.github.com/alumni/');
    
    const gdeLink = page.getByRole('heading', { name: 'Google Developer Expert' }).getByRole('link');
    await expect(gdeLink).toHaveAttribute('href', 'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien');
    
    const mvpLink = page.getByRole('heading', { name: 'Former Microsoft Most Valuable Professional' }).getByRole('link');
    await expect(mvpLink).toHaveAttribute('href', 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien');
    
    const mdeLink = page.getByRole('heading', { name: 'Media Developer Expert' }).getByRole('link');
    await expect(mdeLink).toHaveAttribute('href', 'https://cloudinary.com/mde');
    
    const auth0Link = page.getByRole('heading', { name: 'Auth0 Ambassador' }).getByRole('link');
    await expect(auth0Link).toHaveAttribute('href', 'https://auth0.com/ambassador-program/');
    
    const certLink = page.getByRole('heading', { name: 'Microsoft Certified' }).getByRole('link');
    await expect(certLink).toHaveAttribute('href', 'https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377');
    
    const diplomaLink = page.getByRole('heading', { name: 'Bachelor\'s Level Diploma' }).getByRole('link');
    await expect(diplomaLink).toHaveAttribute('href', 'https://openclassrooms.com/en/paths/315-front-end-developer');
    
    const techDegreeLink = page.getByRole('heading', { name: 'Full Stack JavaScript Tech Degree' }).getByRole('link');
    await expect(techDegreeLink).toHaveAttribute('href', 'https://teamtreehouse.com/techdegree');
  });
});
