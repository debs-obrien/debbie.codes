/**
 * Shared helpers for agent-facing blog markdown copies (/blog/<slug>.md).
 */

export function stripFrontmatter(raw: string) {
  return raw.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

/** Minimal YAML frontmatter parse for blog markdown routes (scalars + tag lists). */
export function parseBlogFrontmatter(raw: string): Record<string, unknown> {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}
  const out: Record<string, unknown> = {}
  for (const line of match[1].split(/\r?\n/)) {
    const key = line.match(/^(\w+):(.*)$/)
    if (!key)
      continue
    const rest = key[2].trim()
    if (rest === 'true') {
      out[key[1]] = true
      continue
    }
    if (rest === 'false') {
      out[key[1]] = false
      continue
    }
    if (rest.startsWith('[') && rest.endsWith(']')) {
      out[key[1]] = rest
        .slice(1, -1)
        .split(',')
        .map(part => part.trim().replace(/^['"]|['"]$/g, ''))
        .filter(Boolean)
      continue
    }
    out[key[1]] = rest.replace(/^["']|["']$/g, '')
  }
  return out
}

/**
 * Turn Nuxt Content / Vue embed markup into plain markdown links while leaving
 * fenced code examples untouched.
 */
export function cleanBlogMarkdownBody(rawBody: string) {
  const fences: string[] = []
  let text = String(rawBody).replace(/```[\s\S]*?```/g, (block) => {
    fences.push(block)
    return `\0FENCE${fences.length - 1}\0`
  })

  text = text.replace(
    /<lite-youtube\b[\s\S]*?<\/lite-youtube>|<lite-youtube\b[^/]*\/>/gi,
    (tag) => {
      const id = tag.match(/\bvideoid=["']([^"']+)["']/i)?.[1]
      return id ? `[Watch on YouTube](https://www.youtube.com/watch?v=${id})` : ''
    },
  )
  text = text.replace(
    /::youtube\{[^}]*\}[ \t]*(?:::[ \t]*)?/g,
    (block) => {
      const id = block.match(/\bid=["']([^"']+)["']/)?.[1]
      return id ? `[Watch on YouTube](https://www.youtube.com/watch?v=${id})` : ''
    },
  )
  text = text.replace(/^::[\w-]+(\{[^}]*\})?\s*$/gm, '')
  text = text.replace(/^::\s*$/gm, '')
  // Nuxt Content / @nuxt/image size attrs: ![alt](src){width="1640" height="815"}
  text = text.replace(/(!\[[^\]]*\]\([^)]+\))\{[^}\n]*\}/g, '$1')

  text = text.replace(/\0FENCE(\d+)\0/g, (_match, index: string) => fences[Number(index)] ?? '')
  return `${text.replace(/\n{3,}/g, '\n\n').trim()}\n`
}

export function renderBlogMarkdownFile(opts: {
  title: string
  date: string
  description?: string
  url: string
  tags?: string[]
  raw: string
}) {
  const lines = [
    `# ${opts.title}`,
    '',
    `- Date: ${opts.date}`,
  ]
  const description = (opts.description || '').trim()
  if (description)
    lines.push(`- Description: ${description}`)
  lines.push(`- Canonical: ${opts.url}`, '')
  const tags = opts.tags || []
  if (tags.length)
    lines.push(`- Tags: ${tags.join(', ')}`, '')
  lines.push('---', '', cleanBlogMarkdownBody(stripFrontmatter(opts.raw)))
  return `${lines.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`
}
