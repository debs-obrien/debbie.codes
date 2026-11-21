/**
 * Patch Nitro's `.vercel/output/config.json` after the vercel preset writes it.
 *
 * Why this exists:
 * - Do NOT set `trailingSlash` in vercel.json — platform 308s beat alias redirects.
 * - Insert `^/(.*)/$` → `/$1` **301** after status redirects (alias `/talks/` etc. win).
 * - Header-only routes need `continue: true`.
 * - Accept: text/markdown on `/blog/<slug>` goes to `__fallback` so Nitro middleware
 *   can apply q-value logic + Link + markdown 404 (Netlify edge parity). A static
 *   `.md` rewrite cannot honour `q=0` / HTML-preferred Accept.
 * - Replace the catch-all SSR fallback with static `/404.html` so unknown dynamic
 *   routes 404 like Netlify generate (no empty 200 SSR pages / JSON 404 bodies).
 */
import { readFile, writeFile } from 'node:fs/promises'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')

/** Official convertTrailingSlash(false) pattern; 301 to match Netlify. */
export const VERCEL_TRAILING_SLASH_STRIP = {
  src: '^/(.*)/$',
  status: 301,
  headers: { Location: '/$1' },
}

/**
 * Route Accept: text/markdown blog HTML URLs to Nitro (q-value aware).
 * `[\w-]+` excludes `/blog/<slug>.md` so static markdown files stay on the
 * filesystem (Netlify edge `excludedPath: ['/blog/*.md']` parity).
 */
export const VERCEL_BLOG_MARKDOWN_ACCEPT = {
  src: '^/blog/([\\w-]+)$',
  has: [
    {
      type: 'header',
      key: 'accept',
      value: '.*[Tt]ext/[Mm]arkdown.*',
    },
  ],
  dest: '/__fallback',
}

/** Static HTML 404 after filesystem (Netlify generate parity). */
export const VERCEL_STATIC_404 = {
  src: '/(.*)',
  dest: '/404.html',
  status: 404,
}

/**
 * Index of the trailing-slash strip route, or -1.
 * @param {Array<Record<string, unknown>>} routes
 */
export function findTrailingSlashStripIndex(routes) {
  return routes.findIndex(
    r => r && r.src === VERCEL_TRAILING_SLASH_STRIP.src && r.status === 301,
  )
}

/**
 * Assert alias redirects that end in `/` appear before the generic slash strip.
 * @param {Array<Record<string, unknown>>} routes
 * @returns {{ ok: boolean, issues: string[] }} Validation result with issue messages.
 */
export function assertAliasRedirectsBeforeSlashStrip(routes) {
  /** @type {string[]} */
  const issues = []
  const stripIdx = findTrailingSlashStripIndex(routes)
  if (stripIdx === -1) {
    issues.push('missing trailing-slash strip route ^/(.*)/$ 301')
    return { ok: false, issues }
  }

  const required = [
    { src: '/talks/', location: '/speaking' },
    { src: '/resources/', location: '/' },
  ]
  for (const { src, location } of required) {
    const idx = routes.findIndex(r => r && r.src === src && r.status === 301)
    if (idx === -1) {
      issues.push(`missing alias redirect ${src} → ${location}`)
      continue
    }
    const loc = rLocation(routes[idx])
    if (loc !== location)
      issues.push(`${src} Location is ${loc || '(none)'}, want ${location}`)
    if (idx > stripIdx)
      issues.push(`${src} redirect at index ${idx} is after slash strip at ${stripIdx}`)
  }

  const has308Strip = routes.some(
    r => r && r.status === 308 && typeof r.src === 'string' && /\/\.\*\)?\/\$|\/\$/.test(r.src),
  )
  if (has308Strip)
    issues.push('found status 308 trailing-slash style route (remove vercel.json trailingSlash)')

  return { ok: issues.length === 0, issues }
}

function rLocation(route) {
  const h = route?.headers
  if (!h || typeof h !== 'object')
    return ''
  return h.Location || h.location || ''
}

/**
 * Ensure prerendered 404.html exists in the Vercel static output.
 * Prefer Nitro's own prerendered shell (noindex, ~5KB like Netlify generate).
 * `nuxt build` sometimes omits it; fall back to dist/ or a minimal noindex page.
 * @param {string} staticDir
 */
async function ensureStatic404(staticDir) {
  const dest = resolve(staticDir, '404.html')
  try {
    const existing = await readFile(dest, 'utf8')
    // Keep Nitro's prerendered shell; replace a stale/empty stub.
    if (existing.includes('noindex') && existing.length > 500)
      return
  }
  catch {
    // missing
  }
  const candidates = [
    resolve(staticDir, '404.html'),
    resolve(root, '.vercel/output/static/404.html'),
    resolve(root, 'dist/404.html'),
    resolve(root, '.output/public/404.html'),
  ]
  for (const src of candidates) {
    if (src === dest)
      continue
    try {
      const html = await readFile(src, 'utf8')
      if (html.includes('noindex') && html.length > 500) {
        await writeFile(dest, html)
        return
      }
    }
    catch {
      // try next
    }
  }
  // Last resort: noindex shell. Prefer a prerendered themed page when the
  // `/__prerender-404-seed` route (or crawl) produced one under another name.
  const themed = [
    resolve(staticDir, '404.html'),
    resolve(staticDir, '__prerender-404-seed.html'),
    resolve(staticDir, '__prerender-404-seed/index.html'),
  ]
  for (const src of themed) {
    if (src === dest)
      continue
    try {
      const html = await readFile(src, 'utf8')
      if (html.includes('noindex') && html.length > 500) {
        await writeFile(dest, html)
        return
      }
    }
    catch {
      // try next
    }
  }
  await writeFile(
    dest,
    '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex, nofollow"><title>Page not found · Debbie Codes</title></head><body><h1>Page not found</h1><p><a href="/">Home</a></p></body></html>\n',
  )
}

/**
 * @param {import('nitropack').Nitro} nitro
 */
export async function patchVercelBuildConfig(nitro) {
  const preset = String(nitro.options.preset || '')
  if (!preset.startsWith('vercel'))
    return

  const outputDir = nitro.options.output.dir
  const configPath = resolve(outputDir, 'config.json')
  const staticDir = resolve(outputDir, 'static')
  await ensureStatic404(staticDir)

  // prerender:done can fire before Nitro writes config.json; compiled retries.
  let raw
  try {
    raw = await readFile(configPath, 'utf8')
  }
  catch {
    return
  }
  const config = JSON.parse(raw)
  if (!Array.isArray(config.routes))
    config.routes = []

  delete config.trailingSlash

  for (const route of config.routes) {
    if (!route || route.handle)
      continue
    const headerOnly = route.headers
      && route.status == null
      && route.dest == null
      && !route.middlewarePath
    if (headerOnly)
      route.continue = true
  }

  const fsIdx = config.routes.findIndex(r => r && r.handle === 'filesystem')
  const beforeFs = fsIdx === -1 ? config.routes.length : fsIdx

  let insertAt = 0
  for (let i = 0; i < beforeFs; i++) {
    if (config.routes[i]?.status != null)
      insertAt = i + 1
  }

  if (findTrailingSlashStripIndex(config.routes) === -1)
    config.routes.splice(insertAt, 0, { ...VERCEL_TRAILING_SLASH_STRIP })

  // Accept markdown → serverless middleware (before filesystem + slash strip).
  const hasMd = config.routes.some(
    r => r && r.src === VERCEL_BLOG_MARKDOWN_ACCEPT.src && r.dest === '/__fallback',
  )
  if (!hasMd) {
    const stripIdx = findTrailingSlashStripIndex(config.routes)
    const mdAt = stripIdx === -1 ? insertAt : stripIdx
    config.routes.splice(mdAt, 0, { ...VERCEL_BLOG_MARKDOWN_ACCEPT })
  }

  // Replace broad SSR catch-all with static 404.html (Netlify generate parity).
  const catchAllIdx = config.routes.findIndex(
    r => r && r.src === '/(.*)' && r.dest === '/__fallback',
  )
  if (catchAllIdx !== -1) {
    config.routes[catchAllIdx] = { ...VERCEL_STATIC_404 }
  }
  else if (!config.routes.some(r => r && r.dest === '/404.html' && r.status === 404)) {
    config.routes.push({ ...VERCEL_STATIC_404 })
  }

  const check = assertAliasRedirectsBeforeSlashStrip(config.routes)
  if (!check.ok) {
    console.warn(
      `[vercel-build-config] trailing-slash route order issues:\n${check.issues.map(i => `  - ${i}`).join('\n')}`,
    )
  }

  await writeFile(configPath, `${JSON.stringify(config, null, 2)}\n`)
}
