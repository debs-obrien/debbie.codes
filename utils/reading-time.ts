/**
 * Extract plain text from Nuxt Content body (minimark AST, classic AST, or string).
 */
export function extractTextFromContent(content: unknown): string {
  if (!content) return ''
  if (typeof content === 'string') return content
  if (typeof content === 'number' || typeof content === 'boolean') return String(content)

  if (Array.isArray(content)) {
    // Minimark element: [tag, props, ...children]
    if (
      content.length >= 2
      && typeof content[0] === 'string'
      && content[1] !== null
      && typeof content[1] === 'object'
      && !Array.isArray(content[1])
    ) {
      return content.slice(2).map(extractTextFromContent).filter(Boolean).join(' ')
    }
    return content.map(extractTextFromContent).filter(Boolean).join(' ')
  }

  if (typeof content === 'object') {
    const node = content as Record<string, unknown>
    if (node.type === 'minimark' && node.value != null) {
      return extractTextFromContent(node.value)
    }
    if (typeof node.value === 'string') return node.value
    if (node.children != null) return extractTextFromContent(node.children)
    if (node.value != null) return extractTextFromContent(node.value)
  }

  return ''
}

/**
 * Calculate estimated reading time for content
 * @param content - The text content to analyze
 * @param wordsPerMinute - Average reading speed (default: 200 wpm)
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string, wordsPerMinute: number = 200): number {
  if (!content || typeof content !== 'string') return 0
  
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