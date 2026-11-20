/**
 * Build Nitro routeRules that mirror Netlify redirects/headers for dual deploy.
 * Source of truth for redirects remains public/_redirects (Netlify untouched).
 * Header rules match netlify.toml + generated public/_headers markdown blocks.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const SECURITY_HEADERS = {
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
}

/**
 * True when a Vue page owns this path (Netlify serves the prerendered file and
 * a non-forced `_redirects` rule is shadowed — e.g. pages/videos/all.vue).
 * @param {string} from
 */
function hasPageForPath(from) {
  const rel = from.replace(/^\//, '').replace(/\/$/, '')
  if (!rel || rel.includes('%') || rel.includes('*'))
    return false
  return [
    join(root, 'pages', `${rel}.vue`),
    join(root, 'pages', rel, 'index.vue'),
  ].some(existsSync)
}

/**
 * Parse Netlify `_redirects` into Nitro redirect routeRules.
 * First-match wins (Netlify semantics). Skips paths owned by a page file so
 * prerendered navigateTo HTML matches live (e.g. /videos/all → 200 meta-refresh).
 * @param {string} [redirectsText]
 * @returns {Record<string, { redirect: { to: string, statusCode: number } }>} routeRules map
 */
export function redirectsToRouteRules(redirectsText) {
  const text = redirectsText ?? readFileSync(join(root, 'public/_redirects'), 'utf8')
  /** @type {Record<string, { redirect: { to: string, statusCode: number } }>} */
  const rules = {}
  for (const rawLine of text.split('\n')) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#'))
      continue
    const parts = line.split(/\s+/)
    if (parts.length < 3)
      continue
    const [from, to, statusRaw] = parts
    const statusCode = Number.parseInt(statusRaw.replace(/!$/, ''), 10)
    if (!from || !to || !Number.isFinite(statusCode))
      continue
    // Netlify first-match: keep the earliest rule for a given path.
    if (rules[from])
      continue
    // Page file shadows non-forced redirects on Netlify — omit so Vercel matches live.
    if (!statusRaw.endsWith('!') && hasPageForPath(from))
      continue
    rules[from] = { redirect: { to, statusCode } }
  }
  return rules
}

/**
 * Site-wide headers from netlify.toml (not the generated per-.md _headers file).
 * Security headers are merged into every rule: Vercel header routes do not
 * continue to `/**`, so `/llms.txt` etc. would otherwise lose X-Frame-Options.
 * @returns {Record<string, { headers: Record<string, string> }>} routeRules map
 */
export function siteHeaderRouteRules() {
  return {
    '/**': {
      headers: { ...SECURITY_HEADERS },
    },
    '/': {
      headers: {
        ...SECURITY_HEADERS,
        Link: '</llms.txt>; rel="describedby"',
      },
    },
    '/llms.txt': {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
    '/llms-full.txt': {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
    '/blog/**': {
      headers: {
        ...SECURITY_HEADERS,
        Vary: 'Accept',
      },
    },
    '/images/**': {
      headers: {
        ...SECURITY_HEADERS,
        'Cache-Control': 'public, max-age=604800, must-revalidate',
      },
    },
    '/feed.xml': {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
    '/sitemap.xml': {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'application/xml; charset=utf-8',
      },
    },
    '/robots.txt': {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'text/plain; charset=utf-8',
      },
    },
  }
}

/**
 * Per published /blog/<slug>.md headers (same fields as generated public/_headers).
 * @param {Array<{ path?: string, canonical?: string, url?: string }>} blogItems
 * @returns {Record<string, { headers: Record<string, string> }>} routeRules map
 */
export function blogMarkdownHeaderRouteRules(blogItems = []) {
  /** @type {Record<string, { headers: Record<string, string> }>} */
  const rules = {}
  for (const item of blogItems) {
    const path = typeof item?.path === 'string' ? item.path : ''
    if (!path.startsWith('/blog/'))
      continue
    const canonical = (typeof item.canonical === 'string' && item.canonical)
      || (typeof item.url === 'string' && item.url)
      || `https://debbie.codes${path}`
    rules[`${path}.md`] = {
      headers: {
        ...SECURITY_HEADERS,
        'Content-Type': 'text/markdown; charset=utf-8',
        'Link': `<${canonical}>; rel="canonical"`,
        'X-Robots-Tag': 'noindex',
      },
    }
  }
  return rules
}

/**
 * Dual-host routeRules. Redirects are Vercel-only: on Netlify generate they
 * prerender as meta-refresh HTML (200) and shadow `public/_redirects` 301s.
 * @param {{
 *   blogItems?: Array<{ path?: string, canonical?: string, url?: string }>,
 *   includeRedirects?: boolean,
 * }} [opts]
 * @returns {Record<string, object>} routeRules map
 */
export function buildHostingRouteRules(opts = {}) {
  return {
    ...(opts.includeRedirects === false ? {} : redirectsToRouteRules()),
    ...siteHeaderRouteRules(),
    ...blogMarkdownHeaderRouteRules(opts.blogItems || []),
  }
}
