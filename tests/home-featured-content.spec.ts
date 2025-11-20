import { expect, test } from '@playwright/test';

test.describe('Home Page Featured Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays main hero section with correct information', async ({ page }) => {
    // Check for main heading - the CreativeHero displays the name
    // Note: The heading might appear multiple times due to glitch effects
    const heading = page.getByRole('heading', { level: 1 }).first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('Debbie');
    
    // Check for subtitle/role
    await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();
    
    // Check for profile image in header
    const profileImage = page.getByRole('img', { name: 'Debbie O\'Brien' }).first();
    await expect(profileImage).toBeVisible();
  });

  // Featured Posts section no longer exists after redesign
  test.fixme('featured post section displays correctly', async ({ page }) => {
    // This section has been removed in the redesign
    // The home page now shows Recent Blog Posts instead of Featured Posts
  });

  test('recent blog posts section displays correctly', async ({ page }) => {
    const blogSection = page.getByRole('region', { name: 'Recent Blog Posts' });
    await expect(blogSection).toBeVisible();

    // Check for section heading with link
    await expect(blogSection.getByRole('heading', { name: 'Recent Blog Posts' })).toBeVisible();
    await expect(blogSection.getByRole('link', { name: 'Recent Blog Posts' })).toBeVisible();

    // Check that multiple blog posts are displayed
    const blogPosts = blogSection.getByRole('article');
    const blogPostCount = await blogPosts.count();
    expect(blogPostCount).toBeGreaterThan(0);
    expect(blogPostCount).toBeLessThanOrEqual(6); // Typically shows 6 recent posts

    // Check first blog post structure
    const firstPost = blogPosts.first();
    await expect(firstPost.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(firstPost.locator('time')).toBeVisible();
  });

  test('recent videos section displays correctly', async ({ page }) => {
    const videosSection = page.getByRole('region', { name: 'Recent Videos' });
    await expect(videosSection).toBeVisible();
    
    // Check for section heading with link
    await expect(videosSection.getByRole('heading', { name: 'Recent Videos' })).toBeVisible();
    await expect(videosSection.getByRole('link', { name: 'Recent Videos' })).toBeVisible();
    
    // Check that videos are displayed (should show 5 videos after redesign)
    // First video is a main large video, then 4 smaller videos
    const firstVideo = videosSection.getByRole('link').first();
    await expect(firstVideo).toBeVisible();
    
    // Check for video images
    const images = videosSection.getByRole('img');
    const imageCount = await images.count();
    expect(imageCount).toBeGreaterThan(0);
    expect(imageCount).toBeLessThanOrEqual(5);
  });

  test('recent podcasts section displays correctly', async ({ page }) => {
    const podcastsSection = page.getByRole('region', { name: 'Recent Podcasts' });
    await expect(podcastsSection).toBeVisible();
    
    // Check for section heading with link
    await expect(podcastsSection.getByRole('heading', { name: 'Recent Podcasts' })).toBeVisible();
    await expect(podcastsSection.getByRole('link', { name: 'Recent Podcasts' })).toBeVisible();
    
    // Check that podcasts are displayed (should show 2 podcasts after redesign)
    const podcasts = podcastsSection.getByRole('article');
    const podcastCount = await podcasts.count();
    expect(podcastCount).toBe(2);
    
    // Check first podcast structure
    const firstPodcast = podcasts.first();
    await expect(firstPodcast.getByRole('img')).toBeVisible();
    await expect(firstPodcast.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(firstPodcast.locator('time')).toBeVisible();
    
    // Check for external podcast links
    const podcastLinks = firstPodcast.getByRole('link');
    const linkCount = await podcastLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  test('all section links navigate correctly', async ({ page }) => {
    // Test Recent Blog Posts link
    await page.getByRole('link', { name: 'Recent Blog Posts' }).click();
    await expect(page).toHaveURL('/blog');
    
    await page.goBack();
    
    // Test Recent Videos link
    await page.getByRole('link', { name: 'Recent Videos' }).click();
    await expect(page).toHaveURL('/videos');
    
    await page.goBack();
    
    // Test Recent Podcasts link
    await page.getByRole('link', { name: 'Recent Podcasts' }).click();
    await expect(page).toHaveURL('/podcasts');
  });

  // Featured post links no longer exist after redesign
  test.fixme('featured post links work correctly', async ({ page }) => {
    // Featured Posts section has been removed in the redesign
    // The page now shows Recent Blog Posts instead
  });

  test('external credential links work correctly', async ({ page }) => {
    // Verify all credential badge links are present and clickable
    await expect(page.getByRole('link', { name: 'Google GDE' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Former Microsoft MVP' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub Star Alumni' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nuxt Ambassador' })).toBeVisible();
  });

  test('home page content is accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    // Note: The h1 might appear multiple times due to CreativeHero glitch effects
    const h1 = page.getByRole('heading', { level: 1 });
    const h1Count = await h1.count();
    expect(h1Count).toBeGreaterThanOrEqual(1);
    await expect(h1.first()).toContainText(/Debbie/);
    
    const h2s = page.getByRole('heading', { level: 2 });
    const h2Count = await h2s.count();
    expect(h2Count).toBeGreaterThan(0);
    
    // Check that all images have alt text
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // Check if alt attribute exists, or skip hidden images and decorative images
      const ariaHidden = await img.getAttribute('aria-hidden');
      const role = await img.getAttribute('role');
      // Skip images that are explicitly marked as hidden or decorative
      if (ariaHidden === 'true' || role === 'presentation') {
        continue;
      }
      // Check if alt attribute exists, but allow empty string as valid
      expect(alt !== null && alt !== undefined).toBeTruthy();
    }
    
    // Simplified check - just verify some links exist and are accessible
    const links = page.getByRole('link');
    const linkCount = await links.count();
    expect(linkCount).toBeGreaterThan(0);
  });
});
