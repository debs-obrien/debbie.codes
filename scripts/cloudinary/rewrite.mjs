#!/usr/bin/env node
/**
 * Rewrite Cloudinary refs → local /images/content/… paths.
 * Usage:
 *   node scripts/cloudinary/rewrite.mjs --dry-run
 *   node scripts/cloudinary/rewrite.mjs --write
 */
import { readFileSync, writeFileSync } from 'node:fs'
// Collect content md files from inventory occurrences + all content
import { readdirSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

import {
  blankFencesAndInline,
  enlargeCropTransform,
  isCropTransform,
  parseBarePublicId,
  parseCloudinaryUrl,
  splitFrontmatter,
  transformSlug,
} from './parse.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const write = process.argv.includes('--write')
const dryRun = process.argv.includes('--dry-run') || !write

const inventory = JSON.parse(readFileSync(join(root, 'scripts/cloudinary/inventory.json'), 'utf8'))
const manifest = JSON.parse(readFileSync(join(root, 'scripts/cloudinary/manifest.json'), 'utf8'))

const byKey = new Map(manifest.entries.map(e => [e.key, e]))

/** Map any Cloudinary URL or bare id → local path (+ dims). */
function resolveLocal(raw) {
  if (!raw || typeof raw !== 'string')
    return null
  const trimmed = raw.trim()

  // Special: fetch → local WebP master (avoid Netlify remote_images for i.ytimg.com)
  if (/image\/fetch/.test(trimmed) && /J3djzf5bMEs/.test(trimmed)) {
    return {
      localPath: '/images/content/podcasts/mab-podcast-19-hqdefault.webp',
      outWidth: 480,
      outHeight: 360,
      outFormat: 'webp',
      conversion: 'youtube-thumb-local',
    }
  }

  let parsed = parseCloudinaryUrl(trimmed)
  if (!parsed)
    parsed = parseBarePublicId(trimmed)
  if (!parsed)
    return null

  const key = `${parsed.deliveryType}|${parsed.resourceType}|${parsed.transform || ''}|${parsed.publicId}`
  let entry = byKey.get(key)

  // Try without delivery-only transform variants
  if (!entry) {
    for (const e of manifest.entries) {
      if (e.publicId === parsed.publicId && e.resourceType === parsed.resourceType) {
        const wantCrop = isCropTransform(parsed.transform)
        const haveCrop = Boolean(e.crop)
        if (wantCrop === haveCrop) {
          if (!wantCrop || similarCrop(parsed.transform, e.transform)) {
            entry = e
            break
          }
        }
      }
    }
  }

  // Fallback: any entry with same publicId (prefer non-crop for plain)
  if (!entry) {
    const candidates = manifest.entries.filter(e => e.publicId === parsed.publicId)
    entry = candidates.find(e => !e.crop) || candidates[0]
  }

  if (!entry?.localPath)
    return null

  return entry
}

function similarCrop(a, b) {
  const norm = t => (t || '').replace(/f_[^,/]+,?/g, '').replace(/q_[^,/]+,?/g, '').replace(/fl_lossy,?/g, '').replace(/e_sharpen,?/g, '')
  return norm(a) === norm(b) || transformSlug(enlargeCropTransform(a)) === transformSlug(enlargeCropTransform(b))
}

const URL_RE = /https?:\/\/res\.cloudinary\.com\/[^\s"'`)>\]]+/gi

function rewriteFrontmatter(fm) {
  const lines = fm.split('\n')
  const out = []
  let changes = 0
  for (const line of lines) {
    // Drop provider: cloudinary
    if (/^\s*provider:\s*cloudinary\s*$/.test(line)) {
      changes++
      continue
    }

    const m = line.match(/^(image|ogImage):\s*(.+?)\s*$/)
    if (m) {
      let raw = m[2].trim()
      const quoted = ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith('\'') && raw.endsWith('\'')))
      if (quoted)
        raw = raw.slice(1, -1)

      if (
        /res\.cloudinary\.com/i.test(raw)
        || raw.includes('debbie.codes/')
        || /^v\d+\//.test(raw)
        || /^(?:f_|c_|fl_|e_|g_|q_|w_|h_)/.test(raw)
      ) {
        const entry = resolveLocal(raw)
        if (entry?.localPath) {
          out.push(`${m[1]}: ${entry.localPath}`)
          changes++
          continue
        }
      }
    }
    out.push(line)
  }
  return { text: out.join('\n'), changes }
}

function rewriteBody(body, file, hasHeroImage) {
  let changes = 0
  const live = blankFencesAndInline(body)

  // Build list of URL matches in original body with fence awareness
  const replacements = [] // {start, end, next}

  for (const m of body.matchAll(URL_RE)) {
    const url = m[0].replace(/[.,;:]+$/, '')
    const start = m.index
    const end = start + m[0].length
    // Skip if this region is fenced (live blanked it)
    const liveSlice = live.slice(start, end)
    if (!liveSlice.includes('res.cloudinary.com')) {
      // fenced or inline-code blanked
      continue
    }
    const entry = resolveLocal(url)
    if (!entry?.localPath)
      continue
    replacements.push({ start, end: start + url.length, url, entry })
  }

  // Apply URL replacements from end so indices stay valid
  let text = body
  for (const r of replacements.sort((a, b) => b.start - a.start)) {
    text = text.slice(0, r.start) + r.entry.localPath + text.slice(r.end)
    changes++
  }

  // Markdown images: ![alt](path) → add {width height} when missing
  text = text.replace(/!\[([^\]]*)\]\((\/images\/content\/[^)\s]+)\)(\{[^}]*\})?/g, (full, alt, path, attrs) => {
    const entry = manifest.entries.find(e => e.localPath === path)
    if (!entry?.outWidth)
      return full
    // GIF→MP4: replace markdown image with video block
    if (entry.outFormat === 'mp4' && /gif-to-mp4/.test(entry.conversion || '')) {
      changes++
      const poster = entry.posterPath || path.replace(/\.mp4$/, '-poster.jpg')
      const label = alt ? ` aria-label="${alt.replace(/"/g, '&quot;')}"` : ''
      return `<video${label} autoplay muted loop playsinline width="${entry.outWidth}" height="${entry.outHeight}" poster="${poster}" preload="none">\n  <source src="${path}" type="video/mp4">\n</video>`
    }
    if (attrs)
      return full
    changes++
    return `![${alt}](${path}){width="${entry.outWidth}" height="${entry.outHeight}"}`
  })

  // Raw <img ... provider="cloudinary" ...> — lowercase tag only so fenced
  // JSX `<Img />` component examples are left untouched.
  text = text.replace(/<img\b([^>]*)>/g, (full, attrs) => {
    let next = attrs
    let changed = false
    if (/\bprovider\s*=/.test(next)) {
      next = next.replace(/\s*provider\s*=\s*["'][^"']*["']/gi, '')
      changed = true
    }
    if (/\bpreset\s*=/.test(next)) {
      next = next.replace(/\s*preset\s*=\s*["'][^"']*["']/gi, '')
      changed = true
    }
    const srcM = next.match(/\bsrc\s*=\s*["']([^"']+)["']/i)
    if (srcM) {
      const entry = manifest.entries.find(e => e.localPath === srcM[1])
      if (entry?.outWidth && !/\bwidth\s*=/.test(next)) {
        next += ` width="${entry.outWidth}" height="${entry.outHeight}"`
        changed = true
      }
    }
    if (changed)
      changes++
    return `<img${next}>`
  })

  // <video> blocks: drop ogg, set preload/playsinline/dims, local poster
  text = text.replace(/<video\b([^>]*)>([\s\S]*?)<\/video>/gi, (full, attrs, inner) => {
    let a = attrs
    let changed = false
    // Fix width="auto" height="auto"
    if (/width\s*=\s*["']auto["']/i.test(a)) {
      a = a.replace(/width\s*=\s*["']auto["']/gi, '')
      changed = true
    }
    if (/height\s*=\s*["']auto["']/i.test(a)) {
      a = a.replace(/height\s*=\s*["']auto["']/gi, '')
      changed = true
    }
    if (!/\bpreload\s*=/.test(a)) {
      a += ' preload="none"'
      changed = true
    }
    if (!/\bplaysinline\b/i.test(a)) {
      a += ' playsinline'
      changed = true
    }

    // Drop ogg sources
    const newInner = inner.replace(/\s*<source\b[^>]*type\s*=\s*["']video\/ogg["'][^>]*>/gi, () => {
      changed = true
      return ''
    })

    // Resolve dims from mp4 source
    const srcM = newInner.match(/<source\b[^>]*src\s*=\s*["']([^"']+)["']/i)
    if (srcM) {
      const entry = manifest.entries.find(e => e.localPath === srcM[1])
      if (entry?.outWidth && !/\bwidth\s*=/.test(a)) {
        a += ` width="${entry.outWidth}" height="${entry.outHeight}"`
        changed = true
      }
      if (entry?.posterPath && !/\bposter\s*=/.test(a)) {
        a += ` poster="${entry.posterPath}"`
        changed = true
      }
    }

    if (changed)
      changes++
    return `<video${a}>${newInner}</video>`
  })

  // First body image eager when no hero
  if (!hasHeroImage) {
    let done = false
    text = text.replace(/!\[([^\]]*)\]\((\/images\/content\/[^)\s]+)\)(\{[^}]*\})?/, (full, alt, path, attrs) => {
      if (done)
        return full
      done = true
      const base = attrs || '{}'
      if (/loading=/.test(base))
        return full
      const inner = base.slice(1, -1)
      const next = inner
        ? `{${inner} loading="eager"}`
        : `{loading="eager"}`
      // If we already have width height attrs object
      if (attrs) {
        changes++
        return `![${alt}](${path})${attrs.replace(/\}$/, ' loading="eager"}')}`
      }
      changes++
      return `![${alt}](${path}){loading="eager"}`
    })
  }

  return { text, changes }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap(e =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  )
}

const files = walk(join(root, 'content')).filter(f => f.endsWith('.md')).sort()
const diffLines = []
let totalChanges = 0
const perFile = []

for (const file of files) {
  const rel = relative(root, file)
  const original = readFileSync(file, 'utf8')
  const { frontmatter, body } = splitFrontmatter(original)

  // Skip if no cloudinary refs outside fences
  if (!/cloudinary|debbie\.codes\//i.test(original) && !/^v\d+\//m.test(original))
    continue

  const fm = rewriteFrontmatter(frontmatter)
  const hasHero = /^image:\s*.+/m.test(fm.text) && !/^image:\s*$/m.test(fm.text)
  // hasHero if image field is non-empty after rewrite
  const imageLine = fm.text.match(/^image:\s*(.+)$/m)
  const hasHeroImage = Boolean(imageLine && imageLine[1].trim() && imageLine[1].trim() !== '""')

  const bd = rewriteBody(body, rel, hasHeroImage)
  const changes = fm.changes + bd.changes
  if (!changes)
    continue

  const next = `---\n${fm.text}\n---\n${bd.text}`
  perFile.push({ file: rel, changes })
  totalChanges += changes

  if (dryRun) {
    diffLines.push(`=== ${rel} (${changes} changes) ===`)
    // Brief sample of changed lines
    const a = original.split('\n')
    const b = next.split('\n')
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      if (a[i] !== b[i]) {
        if (a[i] !== undefined)
          diffLines.push(`- ${a[i]}`)
        if (b[i] !== undefined)
          diffLines.push(`+ ${b[i]}`)
      }
    }
    diffLines.push('')
  }
  else {
    writeFileSync(file, next)
  }
}

const summary = { files: perFile.length, changes: totalChanges, mode: dryRun ? 'dry-run' : 'write', perFile }
console.log(JSON.stringify(summary, null, 2))

if (dryRun) {
  const diffPath = join(root, 'scripts/cloudinary/rewrite.diff')
  writeFileSync(diffPath, diffLines.join('\n'))
  console.log(`Wrote ${relative(root, diffPath)}`)
}
