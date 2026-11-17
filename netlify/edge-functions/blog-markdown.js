/**
 * HTTP content negotiation for /blog/<slug>: when Accept prefers
 * text/markdown, serve the existing prerendered /blog/<slug>.md copy.
 * Declared with header matching so browsers/Googlebot never hit this path.
 */

const SITE = 'https://debbie.codes'

function parseQ(params) {
  let q = 1
  for (const param of params) {
    const match = param.trim().match(/^q\s*=\s*([0-9.]+)$/i)
    if (match)
      q = Number(match[1])
  }
  if (Number.isNaN(q) || q < 0)
    return 0
  return q
}

/**
 * Effective q for `type` using the most specific Accept media range
 * (exact, then type/*, then star/star), so wildcards cannot override an
 * explicit preference or exclusion such as text/markdown;q=0.
 */
function quality(accept, type) {
  if (!accept)
    return 0
  const main = type.split('/')[0]
  let exact = null
  let typeWild = null
  let any = null
  for (const part of accept.split(',')) {
    const [rawType, ...params] = part.trim().split(';')
    const media = rawType.trim().toLowerCase()
    if (!media)
      continue
    const q = parseQ(params)
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

function prefersMarkdown(accept) {
  const md = quality(accept, 'text/markdown')
  if (md <= 0)
    return false
  const html = quality(accept, 'text/html')
  return md >= html
}

function markdownNotFound() {
  const body = [
    '# Not Found',
    '',
    'No markdown copy exists for this URL.',
    '',
    `- [llms.txt](${SITE}/llms.txt)`,
    `- [sitemap.xml](${SITE}/sitemap.xml)`,
    '',
  ].join('\n')

  return new Response(body, {
    status: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept',
      'X-Robots-Tag': 'noindex',
      'Cache-Control': 'public, max-age=300',
    },
  })
}

export default async (request, context) => {
  const accept = request.headers.get('accept') || ''
  if (!prefersMarkdown(accept))
    return context.next()

  const { pathname } = new URL(request.url)
  const cleaned = pathname.replace(/\/$/, '') || '/'
  const match = cleaned.match(/^\/blog\/([^/]+)$/)
  if (!match)
    return context.next()

  const slug = match[1]
  if (!slug || slug.endsWith('.md') || slug.includes('..'))
    return context.next()

  const mdPath = `/blog/${slug}.md`
  const mdRes = await context.rewrite(mdPath)

  if (!mdRes || mdRes.status === 404)
    return markdownNotFound()

  if (!mdRes.ok)
    return context.next()

  const body = await mdRes.text()
  const canonicalMatch = body.match(/^Canonical:\s*(\S+)/m)
  const canonical = canonicalMatch?.[1]
    || `${SITE}/blog/${slug}`
  const link = mdRes.headers.get('link')
    || `<${canonical}>; rel="canonical"`
  const robots = mdRes.headers.get('x-robots-tag') || 'noindex'

  return new Response(body, {
    status: 200,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Vary': 'Accept',
      'Link': link,
      'X-Robots-Tag': robots,
      'Cache-Control': 'public, max-age=3600',
    },
  })
}

export const config = {
  path: '/blog/*',
  excludedPath: ['/blog/*.md'],
  header: {
    // Regex: only run when Accept contains text/markdown.
    accept: 'text/markdown',
  },
}
