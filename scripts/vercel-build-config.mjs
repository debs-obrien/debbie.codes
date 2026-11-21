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
 * True when HTML looks like Netlify/Nuxt generate's themed SPA 404 shell
 * (~5KB: noindex + site chrome assets), not the 229 B stub.
 * @param {string} html
 */
export function isThemed404Html(html) {
  if (!html || html.length < 2000)
    return false
  if (!/noindex/i.test(html))
    return false
  // Site chrome: AppHeader hamburger CSS and/or Nuxt SPA shell markers.
  const hasNavChrome = /hamburger|mobile-menu|profile-pic/i.test(html)
  const hasSpaShell = /id=["']__nuxt["']/i.test(html) && /\/_nuxt\//i.test(html)
  return hasNavChrome || hasSpaShell
}

/**
 * Build a themed SPA 404 shell from a prerendered donor page (usually index.html).
 * Used only when Nitro did not write /404.html — keeps remote `vercel deploy`
 * from shipping the 229 B stub.
 * @param {string} donorHtml
 */
export function spa404FromDonorHtml(donorHtml) {
  let html = donorHtml
  // Match @nuxtjs/robots on /404.html: noindex, nofollow.
  if (/name=["']robots["']/i.test(html)) {
    html = html.replace(
      /<meta[^>]+name=["']robots["'][^>]*>/i,
      '<meta name="robots" content="noindex, nofollow" />',
    )
  }
  else {
    html = html.replace(/<\/head>/i, '<meta name="robots" content="noindex, nofollow" /></head>')
  }
  // Live generate 404 has no <title> in the static shell (client sets it).
  html = html.replace(/<title[^>]*>[\s\S]*?<\/title>/i, '')
  // Empty SSR body so crawlers do not see the donor page content.
  html = html.replace(
    /<div id="__nuxt"[^>]*>[\s\S]*?<\/div>/i,
    '<div id="__nuxt"></div>',
  )
  html = html.replace(/\bdata-ssr=["']true["']/gi, 'data-ssr="false"')
  // NUXT_DATA: flip serverRendered true → false when present as a JSON flag.
  html = html.replace(
    /(<script[^>]*id=["']__NUXT_DATA__["'][^>]*>)([\s\S]*?)(<\/script>)/i,
    (_m, open, json, close) => {
      const next = json
        .replace(/"serverRendered":\s*true/g, '"serverRendered":false')
        // Compact payload often encodes serverRendered as a boolean later in the array.
        .replace(/,true\]$/, ',false]')
      return open + next + close
    },
  )
  return html
}

/**
 * Ensure prerendered 404.html exists in the Vercel static output.
 * Prefer Nitro's own prerendered `/404.html` SPA shell (noindex, ~5KB like
 * Netlify generate). Never leave the 229 B stub when a donor page exists —
 * remote `vercel deploy` has no local `dist/` to copy from.
 * @param {string} staticDir
 */
async function ensureStatic404(staticDir) {
  const dest = resolve(staticDir, '404.html')
  try {
    const existing = await readFile(dest, 'utf8')
    if (isThemed404Html(existing))
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
      if (isThemed404Html(html)) {
        await writeFile(dest, html)
        return
      }
    }
    catch {
      // try next
    }
  }
  // Synthesize SPA shell from index.html (or any large prerendered HTML).
  const donors = [
    resolve(staticDir, 'index.html'),
    resolve(staticDir, 'blog.html'),
  ]
  for (const src of donors) {
    try {
      const donor = await readFile(src, 'utf8')
      if (donor.length < 2000 || !/\/_nuxt\//i.test(donor))
        continue
      const html = spa404FromDonorHtml(donor)
      if (isThemed404Html(html)) {
        await writeFile(dest, html)
        return
      }
    }
    catch {
      // try next
    }
  }
  // Absolute last resort — still better than an empty response, but parity
  // will fail this stub (missing nav chrome).
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
