import { expect, test } from '@playwright/test';

test.describe('Home Page Featured Content', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('displays main hero section with correct information', async ({ page }) => {
    // Check for main heading - specify level 1 to avoid conflicts with content
    await expect(page.getByRole('heading', { name: 'Debbie O\'Brien', level: 1 })).toBeVisible();
    
    // Check for subtitle/role
    await expect(page.getByText('Principal Technical Program Manager at Microsoft')).toBeVisible();
    
    // Check for profile image
    const profileImage = page.getByRole('img', { name: 'Debbie O\'Brien' }).first();
    await expect(profileImage).toBeVisible();
    
    // Check for credentials/badges
    await expect(page.getByRole('link', { name: 'Google GDE' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Former Microsoft MVP' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'GitHub Star Alumni' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Nuxt Ambassador' })).toBeVisible();
  });

  test('featured post section displays correctly', async ({ page }) => {
    // Check for section heading
    await expect(page.getByRole('heading', { name: 'Featured Posts' })).toBeVisible();

    // Check for featured post article
    const featuredArticles = page.getByRole('article').filter({ hasText: 'Read more' });
    await expect(featuredArticles).toHaveCount(2);

    // Get the first article for dynamic checks
    const firstArticle = featuredArticles.first();

    // Check for post title link on first article
    const titleLink = firstArticle.getByRole('link').filter({ hasNotText: 'Read more' }).filter({ hasNotText: /^[A-Z][a-z]+$/ }).first();
    await expect(titleLink).toBeVisible();
    await expect(titleLink).toHaveAttribute('href', /.+/);

    // Check for post excerpt on first article
    const excerpt = firstArticle.locator('p');
    await expect(excerpt).toBeVisible();
    await expect(excerpt).not.toBeEmpty();

    // Check for "Read more" link on first article
    const readMoreLink = firstArticle.getByRole('link', { name: /read more/ });
    await expect(readMoreLink).toBeVisible();
    await expect(readMoreLink).toHaveAttribute('href', /.+/);

    // Check for post tags on first article
    const tags = firstArticle.getByRole('list').getByRole('link');
    await expect(tags.first()).toBeVisible();
    await expect(tags.first()).toHaveAttribute('href', /.+/);
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
    
    // Check that multiple videos are displayed
    const videos = videosSection.getByRole('article');
    const videoCount = await videos.count();
    expect(videoCount).toBeGreaterThan(0);
    expect(videoCount).toBeLessThanOrEqual(4); // Typically shows 4 recent videos
    
    // Check first video structure
    const firstVideo = videos.first();
    await expect(firstVideo.getByRole('button')).toBeVisible(); // Video play button
    await expect(firstVideo.getByRole('heading', { level: 3 })).toBeVisible();
    await expect(firstVideo.locator('time')).toBeVisible();
    
    // Check for video tags
    const firstVideoTags = firstVideo.getByRole('list').last();
    const tagLinks = firstVideoTags.getByRole('link');
    const tagCount = await tagLinks.count();
    expect(tagCount).toBeGreaterThanOrEqual(1);
  });

  test('recent podcasts section displays correctly', async ({ page }) => {
    const podcastsSection = page.getByRole('region', { name: 'Recent Podcasts' });
    await expect(podcastsSection).toBeVisible();
    
    // Check for section heading with link
    await expect(podcastsSection.getByRole('heading', { name: 'Recent Podcasts' })).toBeVisible();
    await expect(podcastsSection.getByRole('link', { name: 'Recent Podcasts' })).toBeVisible();
    
    // Check that multiple podcasts are displayed
    const podcasts = podcastsSection.getByRole('article');
    const podcastCount = await podcasts.count();
    expect(podcastCount).toBeGreaterThan(0);
    expect(podcastCount).toBeLessThanOrEqual(3); // Typically shows 3 recent podcasts
    
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

  test('featured post links work correctly', async ({ page }) => {
    // Get the first featured article dynamically
    const featuredArticles = page.getByRole('article').filter({ hasText: 'Read more' });
    const firstArticle = featuredArticles.first();
    
    // Get the main title link (exclude "Read more" links and tag links)
    const titleLink = firstArticle.getByRole('link').filter({ hasNotText: 'Read more' }).filter({ hasNotText: /^[A-Z][a-z]+$/ }).first();
    
    // Get the href to check navigation
    const href = await titleLink.getAttribute('href');
    expect(href).toBeTruthy();
    
    // Click the title link
    await titleLink.click();
    await expect(page).toHaveURL(href as string);
    
    await page.goBack();
    
    // Test "Read more" link dynamically
    const readMoreLink = firstArticle.getByRole('link', { name: /read more/ });
    const readMoreHref = await readMoreLink.getAttribute('href');
    await readMoreLink.click();
    await expect(page).toHaveURL(readMoreHref as string);
    
    await page.goBack();
    
    // Test that tag links work (find any tag link in the first article)
    const tagLinks = firstArticle.locator('a[href^="/blog/tags/"]');
    if (await tagLinks.count() > 0) {
      const firstTagLink = tagLinks.first();
      const tagHref = await firstTagLink.getAttribute('href');
      await firstTagLink.click();
      await expect(page).toHaveURL(tagHref as string);
    }
  });

  test('external credential links work correctly', async ({ page }) => {
    // Test Google GDE link (external)
    const [gdePopup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Google GDE' }).click()
    ]);
    await expect(gdePopup).toHaveURL(/developers\.google\.com/);
    await gdePopup.close();
    
    // Test Microsoft MVP link (external)
    const [mvpPopup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Former Microsoft MVP' }).click()
    ]);
    await expect(mvpPopup).toHaveURL(/mvp\.microsoft\.com/);
    await mvpPopup.close();
    
    // Test GitHub Star Alumni link (external)
    const [starPopup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'GitHub Star Alumni' }).click()
    ]);
    await expect(starPopup).toHaveURL(/stars\.github\.com/);
    await starPopup.close();
    
    // Test Nuxt Ambassador link (external) - URL has changed to v2.nuxt.com
    const [nuxtPopup] = await Promise.all([
      page.waitForEvent('popup'),
      page.getByRole('link', { name: 'Nuxt Ambassador' }).click()
    ]);
    await expect(nuxtPopup).toHaveURL(/nuxt\.com/);
    await nuxtPopup.close();
  });

  test('home page content is accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toHaveCount(1);
    await expect(h1).toHaveText(/Debbie.*O'Brien/);
    
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
    
    // Check that links have meaningful text (not just "click here" or similar)
    const links = page.getByRole('link');
    const linkCount = await links.count();
    
    for (let i = 0; i < linkCount; i++) {
      const link = links.nth(i);
      const text = await link.textContent();
      const ariaLabel = await link.getAttribute('aria-label');
      const title = await link.getAttribute('title');
      const hasChild = await link.locator(':scope > img, :scope > svg').count() > 0;
      
      // Skip links with only image children (likely have aria-label or alt text on the image)
      if (hasChild && (!text || text.trim() === '')) {
        continue;
      }
      
      // Link should have either text content, aria-label, or title
      const hasAccessibleName = (text && text.trim() !== '') || 
                                (ariaLabel && ariaLabel.trim() !== '') || 
                                (title && title.trim() !== '');
      expect(hasAccessibleName).toBeTruthy();
    }
  });
});
