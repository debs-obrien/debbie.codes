import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { defineEventHandler, getHeader, getRequestURL, setHeader, setResponseStatus } from 'h3'
import { parseBlogFrontmatter, renderBlogMarkdownFile } from '../../utils/llms-markdown'

const SITE = 'https://debbie.codes'

const MARKDOWN_NOT_FOUND = [
  '# Not Found',
  '',
  'No markdown copy exists for this URL.',
  '',
  `- [llms.txt](${SITE}/llms.txt)`,
  `- [sitemap.xml](${SITE}/sitemap.xml)`,
  '',
].join('\n')

function asString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function asTags(value: unknown) {
  if (!Array.isArray(value))
    return [] as string[]
  const tags: string[] = []
  for (const tag of value) {
    const normalized = String(tag).trim().toLowerCase().replace(/\s+/g, '-')
    if (normalized && !tags.includes(normalized))
      tags.push(normalized)
  }
  return tags
}

/** Same q-value resolution as netlify/edge-functions/blog-markdown.js. */
function quality(accept: string, type: string) {
  if (!accept)
    return 0
  const main = type.split('/')[0]
  let exact: number | null = null
  let typeWild: number | null = null
  let any: number | null = null
  for (const part of accept.split(',')) {
    const [rawType, ...params] = part.trim().split(';')
    const media = rawType.trim().toLowerCase()
    if (!media)
      continue
    let q = 1
    for (const param of params) {
      const match = param.trim().match(/^q\s*=\s*([0-9.]+)$/i)
      if (match)
        q = Number(match[1])
    }
    if (Number.isNaN(q) || q < 0)
      q = 0
    if (media === type)
      exact = Math.max(exact ?? 0, q)
    else if (media === `${main}/*`)
      typeWild = Math.max(typeWild ?? 0, q)
    else if (media === '*/*')
      any = Math.max(any ?? 0, q)
  }
  if (exact !== null)
    return exact
  if (typeWild !== null)
    return typeWild
  if (any !== null)
    return any
  return 0
}

function prefersMarkdown(accept: string) {
  const md = quality(accept, 'text/markdown')
  if (md <= 0)
    return false
  return md >= quality(accept, 'text/html')
}

function markdownNotFound(event: Parameters<typeof setHeader>[0]) {
  setResponseStatus(event, 404)
  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Vary', 'Accept')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  setHeader(event, 'Cache-Control', 'public, max-age=300')
  return MARKDOWN_NOT_FOUND
}

/**
 * Netlify edge parity for Accept: text/markdown on /blog/<slug> (no .md suffix).
 * Honours q-values; missing posts return the same small markdown 404 body.
 */
export default defineEventHandler((event) => {
  const accept = getHeader(event, 'accept') || ''
  if (!prefersMarkdown(accept))
    return

  const pathname = getRequestURL(event).pathname.replace(/\/$/, '') || '/'
  const match = pathname.match(/^\/blog\/([^/]+)$/)
  if (!match)
    return

  const slug = match[1]
  if (!slug || slug.endsWith('.md') || slug.includes('..'))
    return

  const file = join(process.cwd(), 'content/blog', `${slug}.md`)
  if (!existsSync(file))
    return markdownNotFound(event)

  const raw = readFileSync(file, 'utf8')
  const fm = parseBlogFrontmatter(raw)
  if (fm.published === false)
    return markdownNotFound(event)

  const title = asString(fm.title)
  const date = asString(fm.date)
  if (!title || !date)
    return markdownNotFound(event)

  const localUrl = `${SITE}/blog/${slug}`
  const canonical = asString(fm.canonical) || localUrl
  const body = renderBlogMarkdownFile({
    title,
    date,
    description: asString(fm.description),
    url: canonical,
    tags: asTags(fm.tags),
    video: asString(fm.video),
    raw,
  })

  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Vary', 'Accept')
  setHeader(event, 'Link', `<${canonical}>; rel="canonical"`)
  setHeader(event, 'X-Robots-Tag', 'noindex')
  setHeader(event, 'Cache-Control', 'public, max-age=3600')
  return body
})
