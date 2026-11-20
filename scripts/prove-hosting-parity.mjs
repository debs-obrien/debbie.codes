#!/usr/bin/env node
/**
 * Compare hosting behaviour between a reference origin and a candidate origin.
 *
 * Usage:
 *   node scripts/prove-hosting-parity.mjs <referenceBase> <candidateBase>
 *
 * Example:
 *   node scripts/prove-hosting-parity.mjs https://debbie.codes https://xxx.vercel.app
 *
 * Exit 1 on any mismatch outside the allowlist below.
 */
import { existsSync, readFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

/** Differences that are expected between hosts / build systems. */
const ALLOWLIST = [
  // Hashed Vite/Nuxt assets differ per build.
  { reason: 'hashed _nuxt asset names', pathIncludes: null, header: null, note: 'body/_nuxt only' },
  // Platform response headers.
  { reason: 'x-vercel-* / x-nf-* / server / age / date / etag / cf-*', headerPrefix: true },
  // Vercel/Netlify preview may inject noindex; production HTML still index,follow in meta.
  { reason: 'preview X-Robots-Tag noindex on HTML', header: 'x-robots-tag' },
  // Image delivery host: Netlify Image CDN vs Cloudinary (Vercel) vs static /images.
  { reason: 'image host (Netlify CDN vs Cloudinary vs static)', note: 'og:image + img src' },
]

const SECURITY_HEADERS = ['x-frame-options', 'x-xss-protection']

/** Sample HTML paths for deep image URL checks (keep small — bandwidth). */
const IMAGE_SAMPLE_PATHS = ['/', '/blog', '/hire-me', '/about', '/videos', '/podcasts']

function loadRedirectSources() {
  const text = readFileSync(join(root, 'public/_redirects'), 'utf8')
  const sources = []
  for (const raw of text.split('\n')) {
    const line = raw.trim()
    if (!line || line.startsWith('#'))
      continue
    const [from] = line.split(/\s+/)
    if (from)
      sources.push(from)
  }
  return [...new Set(sources)]
}

function loadSitemapPaths() {
  const local = join(root, 'public/sitemap.xml')
  if (!existsSync(local))
    return ['/', '/blog', '/videos', '/hire-me', '/courses', '/about', '/speaking']
  const xml = readFileSync(local, 'utf8')
  const paths = []
  for (const m of xml.matchAll(/<loc>([^<]+)<\/loc>/g)) {
    try {
      const u = new URL(m[1])
      paths.push(u.pathname || '/')
    }
    catch {
      // skip
    }
  }
  // Cap sitemap crawl for runtime; always keep key pages.
  const preferred = ['/', '/blog', '/videos', '/hire-me', '/courses', '/about', '/speaking', '/podcasts', '/now']
  const rest = paths.filter(p => !preferred.includes(p) && !p.endsWith('.md'))
  return [...new Set([...preferred, ...rest.slice(0, 40)])]
}

function edgeCases() {
  return [
    '/blog/',
    '/videos/',
    '/hire-me/',
    '/courses/',
    '/about/',
    '/speaking/',
    '/resources/',
    '/talks/',
    '/talks',
    '/robots.txt',
    '/feed.xml',
    '/sitemap.xml',
    '/llms.txt',
    '/llms-full.txt',
    '/blog/webmcp-on-my-site.md',
  ]
}

function buildPathList() {
  return [...new Set([
    ...loadSitemapPaths(),
    ...loadRedirectSources(),
    ...edgeCases(),
  ])]
}

/**
 * @param {string} base
 * @param {string} path
 * @param {Record<string, string>} [extraHeaders]
 */
async function probe(base, path, extraHeaders = {}) {
  const url = new URL(path, base.endsWith('/') ? base : `${base}/`).toString()
  const res = await fetch(url, {
    redirect: 'manual',
    headers: {
      'user-agent': 'prove-hosting-parity/1.0',
      ...extraHeaders,
    },
  })
  const headers = {}
  res.headers.forEach((v, k) => {
    headers[k.toLowerCase()] = v
  })
  let body = ''
  const ct = headers['content-type'] || ''
  if (/text\/html|text\/plain|text\/markdown|xml|json/i.test(ct) || path.endsWith('.md')) {
    body = await res.text()
  }
  return {
    url,
    status: res.status,
    location: headers.location || '',
    contentType: (headers['content-type'] || '').split(';')[0].trim().toLowerCase(),
    headers,
    body,
  }
}

function metaContent(html, attr, name) {
  const re = new RegExp(
    `<meta[^>]+(?:${attr}=["']${name}["'][^>]+content=["']([^"']+)["']|content=["']([^"']+)["'][^>]+${attr}=["']${name}["'])`,
    'i',
  )
  const m = html.match(re)
  return (m?.[1] || m?.[2] || '').trim()
}

function canonicalHref(html) {
  const m = html.match(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i)
    || html.match(/<link[^>]+href=["']([^"']+)["'][^>]+rel=["']canonical["']/i)
  return (m?.[1] || '').trim()
}

function titleText(html) {
  const m = html.match(/<title[^>]*>([^<]*)<\/title>/i)
  return (m?.[1] || '').trim()
}

function normalizeLocation(loc, base) {
  if (!loc)
    return ''
  try {
    const u = new URL(loc, base)
    return u.pathname + u.search
  }
  catch {
    return loc
  }
}

/** Collect og:image + twitter:image + every img src/srcset URL from HTML. */
function collectImageUrls(html, pageUrl) {
  /** @type {Set<string>} */
  const urls = new Set()
  const og = metaContent(html, 'property', 'og:image')
  const tw = metaContent(html, 'name', 'twitter:image')
  if (og)
    urls.add(og)
  if (tw)
    urls.add(tw)

  for (const m of html.matchAll(/<img\b[^>]*>/gi)) {
    const tag = m[0]
    const src = tag.match(/\bsrc=["']([^"']+)["']/i)?.[1]
    if (src && !src.startsWith('data:')) {
      try {
        urls.add(new URL(src, pageUrl).toString())
      }
      catch {
        // skip
      }
    }
    const srcset = tag.match(/\bsrcset=["']([^"']+)["']/i)?.[1]
    if (srcset) {
      for (const part of srcset.split(',')) {
        const u = part.trim().split(/\s+/)[0]
        if (!u || u.startsWith('data:'))
          continue
        try {
          urls.add(new URL(u, pageUrl).toString())
        }
        catch {
          // skip
        }
      }
    }
  }
  return [...urls]
}

/**
 * @param {Awaited<ReturnType<typeof probe>>} ref
 * @param {Awaited<ReturnType<typeof probe>>} cand
 * @param {string} path
 */
function compareProbe(ref, cand, path) {
  /** @type {string[]} */
  const issues = []

  if (ref.status !== cand.status)
    issues.push(`status ${ref.status} vs ${cand.status}`)

  const refLoc = normalizeLocation(ref.location, ref.url)
  const candLoc = normalizeLocation(cand.location, cand.url)
  if (refLoc !== candLoc)
    issues.push(`location ${refLoc || '(none)'} vs ${candLoc || '(none)'}`)

  // Content-Type: compare primary type loosely for markdown/html.
  if (ref.contentType && cand.contentType && ref.contentType !== cand.contentType) {
    const bothText = /^text\//.test(ref.contentType) && /^text\//.test(cand.contentType)
    const bothXml = /xml/.test(ref.contentType) && /xml/.test(cand.contentType)
    if (!bothText && !bothXml)
      issues.push(`content-type ${ref.contentType} vs ${cand.contentType}`)
  }

  for (const h of SECURITY_HEADERS) {
    const a = (ref.headers[h] || '').toLowerCase()
    const b = (cand.headers[h] || '').toLowerCase()
    if (a && a !== b)
      issues.push(`${h}: ${a} vs ${b || '(missing)'}`)
    if (a && !b)
      issues.push(`${h} missing on candidate`)
  }

  // Cache-Control for static asset prefixes.
  if (path.startsWith('/images/') || path.startsWith('/_nuxt')) {
    const a = ref.headers['cache-control'] || ''
    const b = cand.headers['cache-control'] || ''
    if (a && !b)
      issues.push('cache-control missing on candidate')
  }

  if (/text\/html/i.test(ref.contentType) && ref.body && cand.body) {
    const refTitle = titleText(ref.body)
    const candTitle = titleText(cand.body)
    if (refTitle && candTitle && refTitle !== candTitle)
      issues.push(`title mismatch`)

    const refRobots = metaContent(ref.body, 'name', 'robots')
    const candRobots = metaContent(cand.body, 'name', 'robots')
    // Allow candidate preview to lack index if platform injects noindex header only;
    // meta robots in HTML should still prefer index on production builds.
    if (refRobots && candRobots) {
      const refIndex = /\bindex\b/i.test(refRobots)
      const candIndex = /\bindex\b/i.test(candRobots)
      if (refIndex && !candIndex && !/noindex/i.test(cand.headers['x-robots-tag'] || ''))
        issues.push(`meta robots ${refRobots} vs ${candRobots}`)
    }

    const refOg = metaContent(ref.body, 'property', 'og:image')
    const candOg = metaContent(cand.body, 'property', 'og:image')
    if (refOg && !candOg)
      issues.push('og:image missing on candidate')
    // Vercel candidate must never emit Netlify Image CDN URLs.
    if (candOg && /\/.netlify\/images/i.test(candOg))
      issues.push('og:image still points at /.netlify/images')
    // Cloudinary OG on Vercel is expected (dual-host). Shape-check when present.
    if (candOg && /res\.cloudinary\.com/i.test(candOg)) {
      if (!/f_auto/.test(candOg) || !/q_auto/.test(candOg))
        issues.push('og:image Cloudinary URL missing f_auto,q_auto')
    }

    const refCanon = canonicalHref(ref.body)
    const candCanon = canonicalHref(cand.body)
    if (refCanon && candCanon) {
      try {
        if (new URL(refCanon).pathname !== new URL(candCanon).pathname)
          issues.push(`canonical path ${new URL(refCanon).pathname} vs ${new URL(candCanon).pathname}`)
      }
      catch {
        // skip
      }
    }

    // No /.netlify/images anywhere in candidate HTML (img src / srcset / meta).
    if (/\/\.netlify\/images/i.test(cand.body))
      issues.push('candidate HTML still contains /.netlify/images')
  }

  return issues
}

/**
 * Every og:image and <img> source on sampled pages must return 200 + image/*.
 * @param {string} candBase
 * @param {string[]} htmlPaths
 */
async function checkCandidateImages(candBase, htmlPaths) {
  /** @type {string[]} */
  const issues = []
  /** @type {Set<string>} */
  const seen = new Set()

  for (const path of htmlPaths) {
    const p = await probe(candBase, path)
    if (!/text\/html/i.test(p.contentType) || p.status !== 200)
      continue

    const urls = collectImageUrls(p.body, p.url)
    for (const imgUrl of urls) {
      if (seen.has(imgUrl))
        continue
      seen.add(imgUrl)

      // Skip non-image placeholders / analytics beacons mistaken for imgs.
      if (/googletagmanager|google-analytics|facebook\.com\/tr/i.test(imgUrl))
        continue

      try {
        const img = await fetch(imgUrl, {
          redirect: 'follow',
          headers: { 'user-agent': 'prove-hosting-parity/1.0' },
        })
        const ct = (img.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
        if (!img.ok) {
          issues.push(`${path} image HTTP ${img.status}: ${imgUrl}`)
          continue
        }
        if (!/^image\//i.test(ct) && !/svg/i.test(ct)) {
          issues.push(`${path} image content-type ${ct || '(empty)'}: ${imgUrl}`)
        }
      }
      catch (err) {
        issues.push(`${path} image fetch failed (${err.message}): ${imgUrl}`)
      }
    }
  }

  return issues
}

async function main() {
  const [refBase, candBase] = process.argv.slice(2)
  if (!refBase || !candBase) {
    console.error('Usage: node scripts/prove-hosting-parity.mjs <referenceBase> <candidateBase>')
    process.exit(2)
  }

  const paths = buildPathList()
  console.log(`Reference: ${refBase}`)
  console.log(`Candidate: ${candBase}`)
  console.log(`Paths: ${paths.length}`)
  console.log('Allowlist:', ALLOWLIST.map(a => a.reason).join('; '))
  console.log('')

  const rows = []
  let failures = 0

  for (const path of paths) {
    const ref = await probe(refBase, path)
    const cand = await probe(candBase, path)
    const issues = compareProbe(ref, cand, path)
    const ok = issues.length === 0
    if (!ok)
      failures++
    rows.push({
      path,
      ref: `${ref.status}${ref.location ? ` → ${normalizeLocation(ref.location, ref.url)}` : ''}`,
      cand: `${cand.status}${cand.location ? ` → ${normalizeLocation(cand.location, cand.url)}` : ''}`,
      ok: ok ? 'OK' : 'FAIL',
      issues: issues.join('; '),
    })
  }

  // Markdown Accept negotiation sample
  const mdPath = '/blog/webmcp-on-my-site'
  const refMd = await probe(refBase, mdPath, { accept: 'text/markdown' })
  const candMd = await probe(candBase, mdPath, { accept: 'text/markdown' })
  const mdIssues = []
  if (refMd.status !== candMd.status)
    mdIssues.push(`status ${refMd.status} vs ${candMd.status}`)
  if (!/markdown/i.test(candMd.contentType) && candMd.status === 200)
    mdIssues.push(`candidate content-type ${candMd.contentType} (want markdown)`)
  if (!(candMd.headers.vary || '').toLowerCase().includes('accept') && candMd.status === 200)
    mdIssues.push('candidate missing Vary: Accept')
  rows.push({
    path: `${mdPath} (Accept: text/markdown)`,
    ref: `${refMd.status} ${refMd.contentType}`,
    cand: `${candMd.status} ${candMd.contentType}`,
    ok: mdIssues.length === 0 ? 'OK' : 'FAIL',
    issues: mdIssues.join('; '),
  })
  if (mdIssues.length)
    failures++

  const imageIssues = await checkCandidateImages(candBase, IMAGE_SAMPLE_PATHS)
  for (const msg of imageIssues) {
    failures++
    rows.push({ path: 'image fetch', ref: '-', cand: '-', ok: 'FAIL', issues: msg })
  }
  if (!imageIssues.length) {
    rows.push({
      path: 'image fetch (og + img sample)',
      ref: '-',
      cand: 'OK',
      ok: 'OK',
      issues: '',
    })
  }

  // Print table
  const col = (s, n) => String(s).slice(0, n).padEnd(n)
  console.log(`${col('ok', 4)} ${col('path', 48)} ${col('reference', 28)} ${col('candidate', 28)} issues`)
  console.log('-'.repeat(140))
  for (const r of rows) {
    console.log(`${col(r.ok, 4)} ${col(r.path, 48)} ${col(r.ref, 28)} ${col(r.cand, 28)} ${r.issues}`)
  }

  console.log('')
  console.log(failures ? `${failures} mismatch(es)` : 'All compared paths matched (within allowlist).')
  process.exit(failures ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
