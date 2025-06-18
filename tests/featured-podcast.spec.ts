import { expect, test } from '@playwright/test';

test.describe('Featured Podcast Player', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('featured podcast section is visible', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Featured Podcast' })).toBeVisible();
    
    // Check that the iframe containing the podcast player is present
    await expect(page.locator('iframe')).toBeVisible();
  });

  test('podcast player controls are accessible within iframe', async ({ page }) => {
    const iframe = page.locator('iframe');
    const frameLocator = page.frameLocator('iframe');
    
    await expect(iframe).toBeVisible();
    
    // Check for play/pause button
    await expect(frameLocator.getByRole('button', { name: 'Play or Pause' })).toBeVisible();
    
    // Check for podcast title
    await expect(frameLocator.getByRole('heading', { name: 'Your testing questions answered' })).toBeVisible();
    
    // Check for podcast brand link
    await expect(frameLocator.getByRole('link', { name: 'PodRocket - A web development podcast from LogRocket' })).toBeVisible();
  });

  test('podcast player has additional controls', async ({ page }) => {
    const frameLocator = page.frameLocator('iframe');
    
    // Check for speed control button
    await expect(frameLocator.getByRole('button', { name: 'Change Playback Speed' })).toBeVisible();
    
    // Check for skip buttons
    await expect(frameLocator.getByRole('button', { name: 'Skip Back 15 Seconds' })).toBeVisible();
    await expect(frameLocator.getByRole('button', { name: 'Skip Forward 15 Seconds' })).toBeVisible();
    
    // Check for share/subscribe dialog button
    await expect(frameLocator.getByRole('button', { name: 'Open Share and Subscribe Dialog' })).toBeVisible();
  });

  test('podcast player has download and subscription links', async ({ page }) => {
    const frameLocator = page.frameLocator('iframe');
    
    // Check for download link
    const downloadLink = frameLocator.getByRole('link', { name: 'Download' });
    await expect(downloadLink).toBeVisible();
    
    // Check for subscribe link
    const subscribeLink = frameLocator.getByRole('link', { name: 'Subscribe' });
    await expect(subscribeLink).toBeVisible();
    
    // Check for transcript link
    const transcriptLink = frameLocator.getByRole('link', { name: 'Transcript' });
    await expect(transcriptLink).toBeVisible();
  });

  test('podcast player shows duration information', async ({ page }) => {
    const frameLocator = page.frameLocator('iframe');
    
    // Check for current time display
    await expect(frameLocator.locator('text=00:00:00').first()).toBeVisible();
    
    // Check for duration display
    await expect(frameLocator.locator('text=00:36:15')).toBeVisible();
    
    // Check for progress bar
    await expect(frameLocator.getByRole('progressbar')).toBeVisible();
  });

  test('podcast player maintains proper iframe integration', async ({ page }) => {
    const iframe = page.locator('iframe');
    
    // Iframe should be properly embedded and sized
    await expect(iframe).toBeVisible();
    
    // Iframe should have a proper src attribute (we don't need to check the exact URL as it might be dynamic)
    const src = await iframe.getAttribute('src');
    expect(src).toBeTruthy();
    expect(src).not.toBe('');
    
    // The iframe should be within the Featured Podcast section
    const podcastSection = page.locator('text=Featured Podcast').locator('..').locator('..');
    await expect(podcastSection.locator('iframe')).toBeVisible();
  });
});
