import { test } from '@playwright/test';

test('debug blog navigation', async ({ page }) => {
  await page.goto('/blog/testing-color-mode');
  
  // Get all navigation links
  const navLinks = page.getByRole('link');
  const navCount = await navLinks.count();
  console.log('Total navigation links found:', navCount);
  
  // Look for navigation-specific links (prev/next)
  const allLinkTexts = [];
  for (let i = 0; i < Math.min(navCount, 20); i++) {
    const linkText = await navLinks.nth(i).textContent();
    if (linkText) {
      allLinkTexts.push(linkText.trim());
    }
  }
  console.log('First 20 link texts:', allLinkTexts);
  
  // Look specifically for blog navigation links
  const blogNavLinks = page.locator('a').filter({ hasText: /^(Previous|Next|←|→)/ });
  const blogNavCount = await blogNavLinks.count();
  console.log('Blog navigation links found:', blogNavCount);
  
  if (blogNavCount > 0) {
    for (let i = 0; i < blogNavCount; i++) {
      const linkText = await blogNavLinks.nth(i).textContent();
      const href = await blogNavLinks.nth(i).getAttribute('href');
      console.log(`Blog nav link ${i}: "${linkText}" -> ${href}`);
    }
  }
});
