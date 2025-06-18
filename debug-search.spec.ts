import { test, expect } from '@playwright/test'

test.describe('Debug Search', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/blog')
  })

  test('debug search functionality', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Search articles...')
    console.log('Search input found:', await searchInput.isVisible())
    
    // Get initial count
    const initialCount = await page.getByRole('article').count()
    console.log('Initial article count:', initialCount)
    
    // Search for something
    await searchInput.fill('xyz123nonexistent')
    await page.waitForTimeout(1000)
    
    // Check what happened
    const afterSearchCount = await page.getByRole('article').count()
    console.log('Article count after search:', afterSearchCount)
    
    // Check if search input has the value
    const searchValue = await searchInput.inputValue()
    console.log('Search input value:', searchValue)
    
    // Try to see the page state
    const pageContent = await page.content()
    console.log('Search input in page:', pageContent.includes('xyz123nonexistent'))
  })
})
