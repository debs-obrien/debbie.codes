/**
 * Shared Accept: text/markdown negotiation for /blog/<slug>
 * (Netlify edge `blog-markdown.js` parity).
 */
export const SITE = 'https://debbie.codes'

export const MARKDOWN_NOT_FOUND = [
  '# Not Found',
  '',
  'No markdown copy exists for this URL.',
  '',
  `- [llms.txt](${SITE}/llms.txt)`,
  `- [sitemap.xml](${SITE}/sitemap.xml)`,
  '',
].join('\n')

/** Same q-value resolution as netlify/edge-functions/blog-markdown.js. */
export function quality(accept: string, type: string) {
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

/**
 * True when Accept explicitly mentions text/markdown and prefers it over HTML.
 * Requires a text/markdown token (Netlify edge header gate) so a lone star/star
 * Accept does not negotiate markdown.
 */
export function prefersMarkdown(accept: string) {
  if (!/text\/markdown/i.test(accept))
    return false
  const md = quality(accept, 'text/markdown')
  if (md <= 0)
    return false
  return md >= quality(accept, 'text/html')
}

/** Blog HTML slug only — rejects `.md` and path traversal. */
export function blogHtmlSlug(pathname: string): string | null {
  const cleaned = pathname.replace(/\/$/, '') || '/'
  const match = cleaned.match(/^\/blog\/([\w-]+)$/)
  if (!match)
    return null
  const slug = match[1]
  if (!slug || slug.includes('..'))
    return null
  return slug
}
