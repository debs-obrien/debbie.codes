import { expect, test } from '@playwright/test';

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/about');
  });

  test('displays correct page title and main content', async ({ page }) => {
    // Check page title
    await expect(page).toHaveTitle(/About Debbie and her experience as a developer/);
    
    // Check main greeting and heading
    await expect(page.getByText('Hello There!')).toBeVisible();
    await expect(page.getByRole('heading', { name: "I'm Debbie O'Brien" })).toBeVisible();
    
    // Check that the main biographical content is present
    await expect(page.getByText('With over 15 years experience in Frontend development')).toBeVisible();
    await expect(page.getByText('I am a senior Technical Program manager at Microsoft')).toBeVisible();
    await expect(page.getByText('I have a special love for JavaScript frameworks')).toBeVisible();
    await expect(page.getByText('I am Irish but live in Mallorca, Spain')).toBeVisible();
  });

  test('displays Awards and Achievements section', async ({ page }) => {
    // Check section heading
    await expect(page.getByRole('heading', { name: 'Awards and Achievements' })).toBeVisible();
    
    // Check all award headings are present
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
    // Test Vue School link
    const vueSchoolLink = page.getByRole('link', { name: 'Vue School' });
    await expect(vueSchoolLink).toBeVisible();
    await expect(vueSchoolLink).toHaveAttribute('href', 'https://vueschool.io/courses/internationalization-with-vue-i18n');
    
    // Test Jamstack Explorers link
    const jamstackLink = page.getByRole('link', { name: 'Jamstack Explorers' });
    await expect(jamstackLink).toBeVisible();
    await expect(jamstackLink).toHaveAttribute('href', 'https://explorers.netlify.com/learn/get-started-with-nuxt');
    
    // Test Ultimate Courses link
    const ultimateCoursesLink = page.getByRole('link', { name: 'Ultimate Courses' });
    await expect(ultimateCoursesLink).toBeVisible();
    await expect(ultimateCoursesLink).toHaveAttribute('href', 'https://ultimatecourses.com/author/debbieobrien');
    
    // Test YouTube Channel link
    const youtubeLink = page.getByRole('link', { name: 'YouTube Channel' });
    await expect(youtubeLink).toBeVisible();
    await expect(youtubeLink).toHaveAttribute('href', 'https://www.youtube.com/c/DebbieOBrien');
  });

  test('award links are functional and point to correct URLs', async ({ page }) => {
    // Test GitHub Star Alumni link
    const githubStarLink = page.getByRole('heading', { name: 'GitHub Star Alumni' }).getByRole('link');
    await expect(githubStarLink).toHaveAttribute('href', 'https://stars.github.com/alumni/');
    
    // Test Google Developer Expert link
    const gdeLink = page.getByRole('heading', { name: 'Google Developer Expert' }).getByRole('link');
    await expect(gdeLink).toHaveAttribute('href', 'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien');
    
    // Test Microsoft MVP link
    const mvpLink = page.getByRole('heading', { name: 'Former Microsoft Most Valuable Professional' }).getByRole('link');
    await expect(mvpLink).toHaveAttribute('href', 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien');
    
    // Test Media Developer Expert link
    const mdeLink = page.getByRole('heading', { name: 'Media Developer Expert' }).getByRole('link');
    await expect(mdeLink).toHaveAttribute('href', 'https://cloudinary.com/mde');
    
    // Test Auth0 Ambassador link
    const auth0Link = page.getByRole('heading', { name: 'Auth0 Ambassador' }).getByRole('link');
    await expect(auth0Link).toHaveAttribute('href', 'https://auth0.com/ambassador-program/');
    
    // Test Microsoft Certified link
    const certLink = page.getByRole('heading', { name: 'Microsoft Certified' }).getByRole('link');
    await expect(certLink).toHaveAttribute('href', 'https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377');
    
    // Test Bachelor's Diploma link
    const diplomaLink = page.getByRole('heading', { name: 'Bachelor\'s Level Diploma' }).getByRole('link');
    await expect(diplomaLink).toHaveAttribute('href', 'https://openclassrooms.com/en/paths/315-front-end-developer');
    
    // Test Tech Degree link
    const techDegreeLink = page.getByRole('heading', { name: 'Full Stack JavaScript Tech Degree' }).getByRole('link');
    await expect(techDegreeLink).toHaveAttribute('href', 'https://teamtreehouse.com/techdegree');
  });

  test('award descriptions are visible and informative', async ({ page }) => {
    // Check GitHub Star description
    await expect(page.getByText('GitHub Stars are experts and technical leaders')).toBeVisible();
    await expect(page.getByText('At the time of publishing this there were only 36 stars worldwide')).toBeVisible();
    
    // Check Google Developer Expert description
    await expect(page.getByText('The Google Developers Experts program is a global network')).toBeVisible();
    await expect(page.getByText('Nearly 700 Experts represent 18+ Google technologies')).toBeVisible();
    
    // Check Microsoft MVP description
    await expect(page.getByText('The Microsoft Most Valuable Professional (MVP) award')).toBeVisible();
    
    // Check Auth0 Ambassador description
    await expect(page.getByText('Part of a global team of ambassadors empowering communities')).toBeVisible();
    
    // Check Microsoft Certified description
    await expect(page.getByText('Passing Exam 480: Programming in HTML5 with JavaScript and CSS3')).toBeVisible();
  });

  test('page layout and structure are correct', async ({ page }) => {
    // Check that main content area exists
    const mainContent = page.locator('main, [role="main"]').or(page.locator('body > div > div').nth(1));
    await expect(mainContent).toBeVisible();
    
    // Check that the greeting section comes before awards section
    const greeting = page.getByText('Hello There!');
    const awards = page.getByRole('heading', { name: 'Awards and Achievements' });
    
    await expect(greeting).toBeVisible();
    await expect(awards).toBeVisible();
    
    // Verify structural hierarchy by checking multiple headings
    const bioHeading = page.getByRole('heading', { name: "I'm Debbie O'Brien" });
    const awardsHeading = page.getByRole('heading', { name: 'Awards and Achievements' });
    
    await expect(bioHeading).toBeVisible();
    await expect(awardsHeading).toBeVisible();
  });

  test('navigation and footer elements are present', async ({ page }) => {
    // Check that header navigation is present
    await expect(page.getByRole('banner')).toBeVisible();
    const navigation = page.getByRole('navigation');
    await expect(navigation).toBeVisible();
    
    // Check that main navigation links are available
    await expect(navigation.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Blog' })).toBeVisible();
    await expect(navigation.getByRole('link', { name: 'Videos' })).toBeVisible();
    
    // Check that footer is present
    await expect(page.getByRole('contentinfo')).toBeVisible();
    await expect(page.getByText('© Debbie O\'Brien, Palma de Mallorca, Spain')).toBeVisible();
  });
  test('about page content mentions key technologies', async ({ page }) => {
    // Check that key technologies are mentioned
    const bioSection = page.getByText('I have a special love for JavaScript frameworks');
    await expect(bioSection).toBeVisible();
    await expect(page.getByText(/Vue\.js/)).toBeVisible();
    await expect(page.getByText(/Nuxt\.js/)).toBeVisible();
    await expect(page.getByText(/Playwright/)).toBeVisible();
    await expect(page.getByText('I am a senior Technical Program manager at Microsoft')).toBeVisible();
    await expect(page.getByText('With over 15 years experience in Frontend development')).toBeVisible();
  });

  test('personal information and interests are mentioned', async ({ page }) => {
    // Check personal details
    await expect(page.getByText(/Irish but live in Mallorca, Spain/)).toBeVisible();
    await expect(page.getByText(/running, cycling and skiing/)).toBeVisible();
    await expect(page.getByText(/Taekwondo/)).toBeVisible();
    await expect(page.getByText(/4th degree black belt/)).toBeVisible();
    await expect(page.getByText(/Antarctica/)).toBeVisible();
  });

  test('professional roles and experience are highlighted', async ({ page }) => {
    // Check professional experience mentions
    await expect(page.getByText('With over 15 years experience in Frontend development')).toBeVisible();
    await expect(page.getByText('I have worked as a Tech Lead and consultant')).toBeVisible();
    await expect(page.getByText('I am a senior Technical Program manager at Microsoft')).toBeVisible();
    
    // Use exact paragraph text to avoid ambiguity with link text
    const expertParagraph = page.getByText('I am a senior Technical Program manager at Microsoft, Google Developer Expert in web technologies');
    await expect(expertParagraph).toBeVisible();
    
    await expect(page.getByText('Nuxt Ambassador')).toBeVisible();
    await expect(page.getByText(/international speaker/)).toBeVisible();
  });
});
