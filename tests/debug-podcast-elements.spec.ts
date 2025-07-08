import { test, expect } from '@playwright/test';

test('debug specific podcast elements', async ({ page }) => {
  await page.goto('/podcasts');
  
  // Check exact heading text
  const heading = page.getByRole('heading', { name: 'Podcast Interviews' });
  const headingExists = await heading.count();
  console.log('Main heading exists:', headingExists > 0);
  
  if (headingExists === 0) {
    const allHeadings = await page.locator('h1').allTextContents();
    console.log('All h1 headings:', allHeadings);
  }
  
  // Check description text
  const description = page.getByText('Discover conversations about web development, testing, and developer advocacy');
  const descExists = await description.count();
  console.log('Description text exists:', descExists > 0);
  
  if (descExists === 0) {
    const allParagraphs = await page.locator('p').allTextContents();
    console.log('All paragraphs:', allParagraphs.slice(0, 5));
  }
  
  // Check topics list
  const topicsList = page.getByRole('list', { name: 'topics' });
  const topicsExists = await topicsList.count();
  console.log('Topics list exists:', topicsExists > 0);
  
  if (topicsExists === 0) {
    const allLists = await page.locator('ul, ol').count();
    console.log('Total lists found:', allLists);
    
    const listWithAll = page.getByRole('link', { name: 'All' });
    const allLinkExists = await listWithAll.count();
    console.log('All link exists:', allLinkExists > 0);
  }
});
