import { Buffer } from 'node:buffer'
import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import process from 'node:process'
import { defineEventHandler, getHeader, getRequestURL, setHeader, setResponseStatus } from 'h3'
import {
  blogHtmlSlug,
  MARKDOWN_NOT_FOUND,
  prefersMarkdown,
  SITE,
} from '../../utils/blog-accept-markdown'
import { parseBlogFrontmatter, renderBlogMarkdownFile } from '../../utils/llms-markdown'

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

function markdownNotFound(event: Parameters<typeof setHeader>[0]) {
  setResponseStatus(event, 404)
  setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
  setHeader(event, 'Vary', 'Accept')
  setHeader(event, 'X-Robots-Tag', 'noindex')
  setHeader(event, 'Cache-Control', 'public, max-age=300')
  return MARKDOWN_NOT_FOUND
}

/**
 * Read blog source markdown.
 * 1) Local `content/blog` (nuxt dev / Netlify generate cwd)
 * 2) Nitro serverAssets `assets:blog-md` (Vercel serverless bundle)
 */
async function readBlogSource(slug: string): Promise<string | null> {
  const file = join(process.cwd(), 'content/blog', `${slug}.md`)
  if (existsSync(file))
    return readFileSync(file, 'utf8')

  try {
    const storage = useStorage('assets:blog-md')
    const data = await storage.getItemRaw(`${slug}.md`)
    if (data == null)
      return null
    if (typeof data === 'string')
      return data
    if (data instanceof Uint8Array)
      return Buffer.from(data).toString('utf8')
    return null
  }
  catch {
    return null
  }
}

/**
 * Netlify edge parity: when Accept prefers text/markdown on /blog/<slug>,
 * serve the markdown copy (same body as prerendered /blog/<slug>.md).
 */
export default defineEventHandler(async (event) => {
  const accept = getHeader(event, 'accept') || ''
  if (!prefersMarkdown(accept))
    return

  const slug = blogHtmlSlug(getRequestURL(event).pathname)
  if (!slug)
    return

  // Prefer the prerendered static copy (exact Netlify rewrite parity) when
  // reachable without re-entering this Accept route (.md is excluded).
  const reqUrl = getRequestURL(event)
  try {
    const mdUrl = new URL(`/blog/${slug}.md`, reqUrl.origin)
    const headers: Record<string, string> = {
      // Must not include text/markdown — Build Output would send us to __fallback.
      accept: 'application/octet-stream',
    }
    const oidc = getHeader(event, 'x-vercel-trusted-oidc-idp-token')
    if (oidc)
      headers['x-vercel-trusted-oidc-idp-token'] = oidc
    const bypass = getHeader(event, 'x-vercel-protection-bypass')
    if (bypass)
      headers['x-vercel-protection-bypass'] = bypass

    const mdRes = await fetch(mdUrl, { headers, redirect: 'manual' })
    if (mdRes.ok) {
      const body = await mdRes.text()
      if (body && !body.startsWith('<!DOCTYPE') && !body.startsWith('<html')) {
        const canonicalMatch = body.match(/^Canonical:\s*(\S+)/m)
        const canonical = canonicalMatch?.[1] || `${SITE}/blog/${slug}`
        const link = mdRes.headers.get('link') || `<${canonical}>; rel="canonical"`
        const robots = mdRes.headers.get('x-robots-tag') || 'noindex'
        setHeader(event, 'Content-Type', 'text/markdown; charset=utf-8')
        setHeader(event, 'Vary', 'Accept')
        setHeader(event, 'Link', link)
        setHeader(event, 'X-Robots-Tag', robots)
        setHeader(event, 'Cache-Control', 'public, max-age=3600')
        return body
      }
    }
  }
  catch {
    // Fall through to source render.
  }

  const raw = await readBlogSource(slug)
  if (!raw)
    return markdownNotFound(event)

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
