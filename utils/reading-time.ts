/**
 * Calculate estimated reading time for content
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content) return 0
  
  // Remove HTML tags and normalize whitespace
  const plainText = content
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim()
  
  if (!plainText) return 0
  
  // Count words (split by whitespace and filter empty strings)
  const wordCount = plainText.split(/\s+/).filter(word => word.length > 0).length
  
  // Calculate reading time in minutes, minimum 1 minute
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  
  return Math.max(1, readingTime)
}

/**
 * Format reading time as a human-readable string
 * @param minutes - Reading time in minutes
 * @returns Formatted string like "5 min read"
 */
export function formatReadingTime(minutes: number): string {
  if (minutes <= 0) return '1 min read'
  if (minutes === 1) return '1 min read'
  return `${minutes} min read`
}