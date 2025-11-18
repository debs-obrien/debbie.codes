/**
 * Preferred casing for common tags used across the blog.
 * This ensures consistent capitalization of tag names throughout the site.
 */
export const preferredTagCasing: Record<string, string> = {
  'mcp': 'MCP',
  'ai': 'AI',
  'playwright': 'Playwright',
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'vue': 'Vue',
  'nuxt': 'Nuxt',
  'react': 'React',
  'jamstack': 'JAMstack',
  'devrel': 'Dev Rel',
  'dev-rel': 'Dev Rel',
  'github': 'GitHub',
  'githubcopilot': 'GitHub Copilot',
}

/**
 * Get the display name for a tag using preferred casing.
 * Falls back to the original tag if no preferred casing is defined.
 *
 * @param tag - The tag to get the display name for
 * @returns The display name with proper casing
 */
export function getTagDisplayName(tag: string): string {
  const normalizedTag = tag.toLowerCase().trim()
  return preferredTagCasing[normalizedTag] || tag.trim()
}
