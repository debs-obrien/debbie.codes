#!/usr/bin/env node
/**
 * Read-only inventory of Cloudinary refs across content + Vue/config.
 * Usage: node scripts/cloudinary/inventory.mjs
 * Writes scripts/cloudinary/inventory.json (deterministic).
 */
import { createHash } from 'node:crypto'
import { mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import {
  assetKey,
  blankFencesAndInline,
  isCropTransform,
  parseBarePublicId,
  parseCloudinaryUrl,
  splitFrontmatter,
} from './parse.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const outDir = join(root, 'scripts/cloudinary')
const outFile = join(outDir, 'inventory.json')

const SCAN_DIRS = ['content', 'components', 'pages', 'utils']
const SCAN_FILES = ['nuxt.config.ts', 'netlify.toml', 'content.config.ts']

const URL_RE = /https?:\/\/res\.cloudinary\.com\/[^\s"'`)>\]]+/gi
const BARE_FM_RE = /^(image|ogImage):\s*(.+?)\s*$/m

function walk(dir) {
  try {
    return readdirSync(dir, { withFileTypes: true }).flatMap(entry =>
      entry.isDirectory()
        ? (entry.name === 'node_modules' || entry.name === '.git' ? [] : walk(join(dir, entry.name)))
        : [join(dir, entry.name)],
    )
  }
  catch {
    return []
  }
}

function filesToScan() {
  const files = []
  for (const d of SCAN_DIRS) {
    files.push(...walk(join(root, d)))
  }
  for (const f of SCAN_FILES) {
    const p = join(root, f)
    try {
      readFileSync(p)
      files.push(p)
    }
    catch { /* missing */ }
  }
  return files.filter(f => /\.(md|vue|ts|js|mjs|toml)$/.test(f)).sort()
}

function pushOcc(list, occ) {
  list.push(occ)
}

function classifyParsed(parsed, source) {
  if (!parsed)
    return null
  const crop = isCropTransform(parsed.transform)
  return {
    ...parsed,
    crop,
    source,
  }
}

const occurrences = []
const skippedFence = []

for (const file of filesToScan()) {
  const rel = relative(root, file)
  const text = readFileSync(file, 'utf8')
  const isMd = file.endsWith('.md')

  if (isMd) {
    const { frontmatter, body } = splitFrontmatter(text)

    // Frontmatter fields
    for (const line of frontmatter.split('\n')) {
      const m = line.match(/^(image|ogImage):\s*(.+?)\s*$/)
      if (!m)
        continue
      const field = m[1]
      let raw = m[2].trim()
      if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith('\'') && raw.endsWith('\'')))
        raw = raw.slice(1, -1)

      if (/res\.cloudinary\.com/i.test(raw)) {
        const parsed = classifyParsed(parseCloudinaryUrl(raw), 'frontmatter')
        if (parsed) {
          pushOcc(occurrences, {
            file: rel,
            field,
            kind: 'frontmatter-url',
            match: raw,
            ...parsed,
          })
        }
        continue
      }

      // Bare Cloudinary public id (not unsplash/local)
      if (
        raw.includes('debbie.codes/')
        || /^v\d+\//.test(raw)
        || /^(?:f_|c_|fl_|e_|g_|q_|w_|h_)/.test(raw)
      ) {
        const parsed = classifyParsed(parseBarePublicId(raw), 'frontmatter')
        if (parsed) {
          pushOcc(occurrences, {
            file: rel,
            field,
            kind: 'frontmatter-id',
            match: raw,
            ...parsed,
          })
        }
      }
    }

    // Body: fence-aware
    const live = blankFencesAndInline(body)
    // Also scan original body for fence-only hits
    const bodyUrls = [...body.matchAll(URL_RE)]
    const liveSet = new Set([...live.matchAll(URL_RE)].map(m => m[0]))

    for (const m of bodyUrls) {
      const url = m[0].replace(/[.,;:]+$/, '')
      const inLive = liveSet.has(m[0]) || live.includes(url)
      const parsed = classifyParsed(parseCloudinaryUrl(url), inLive ? 'body' : 'fence')
      if (!inLive) {
        skippedFence.push({
          file: rel,
          match: url,
          reason: 'fence',
          publicId: parsed?.publicId || null,
        })
        continue
      }
      if (!parsed)
        continue
      // HTML comments still count (plan: rewrite them too)
      pushOcc(occurrences, {
        file: rel,
        field: null,
        kind: 'body-url',
        match: url,
        inComment: /<!--[\s\S]*$/.test(body.slice(Math.max(0, m.index - 200), m.index))
          && !/-->/.test(body.slice(Math.max(0, m.index - 200), m.index)),
        ...parsed,
      })
    }

    // Raw <img src="v…/debbie.codes/…"> without full host (rare)
    for (const m of live.matchAll(/\bsrc=["']([^"']*debbie\.codes\/[^"']+)["']/g)) {
      const raw = m[1]
      if (/res\.cloudinary\.com/i.test(raw))
        continue
      const parsed = classifyParsed(parseBarePublicId(raw), 'body')
      if (parsed) {
        pushOcc(occurrences, {
          file: rel,
          field: null,
          kind: 'body-src-id',
          match: raw,
          ...parsed,
        })
      }
    }
  }
  else {
    // Vue / config / utils — no fence skipping except string literals in examples
    // Skip code that is clearly documentation-only inside comments? Keep simple: scan all.
    for (const m of text.matchAll(URL_RE)) {
      const url = m[0].replace(/[.,;:]+$/, '')
      const parsed = classifyParsed(parseCloudinaryUrl(url), 'code')
      if (!parsed)
        continue
      pushOcc(occurrences, {
        file: rel,
        field: null,
        kind: 'code-url',
        match: url,
        ...parsed,
      })
    }

    // provider: 'cloudinary' / provider="cloudinary" / baseURL cloudinary — recorded as config refs
    if (/cloudinary/i.test(text) && !/res\.cloudinary\.com/i.test(text)) {
      // bare provider references without URLs — note in summary only
    }
  }
}

// Dedupe pairs
const pairMap = new Map()
const assetMap = new Map()

for (const occ of occurrences) {
  // Skip fetch special-case from download pairs? Still inventory it.
  const key = assetKey(occ)
  if (!pairMap.has(key)) {
    pairMap.set(key, {
      key,
      publicId: occ.publicId,
      transform: occ.transform || '',
      resourceType: occ.resourceType,
      deliveryType: occ.deliveryType,
      version: occ.version,
      ext: occ.ext,
      crop: occ.crop,
      fetchTarget: occ.fetchTarget || null,
      occurrences: [],
    })
  }
  pairMap.get(key).occurrences.push({
    file: occ.file,
    kind: occ.kind,
    field: occ.field,
    match: occ.match,
  })

  const assetId = `${occ.deliveryType}|${occ.resourceType}|${occ.publicId}`
  if (!assetMap.has(assetId)) {
    assetMap.set(assetId, {
      publicId: occ.publicId,
      resourceType: occ.resourceType,
      deliveryType: occ.deliveryType,
      versions: new Set(),
      exts: new Set(),
    })
  }
  const a = assetMap.get(assetId)
  if (occ.version)
    a.versions.add(occ.version)
  if (occ.ext)
    a.exts.add(occ.ext)
}

const pairs = [...pairMap.values()]
  .map(p => ({
    ...p,
    occurrences: p.occurrences.sort((a, b) =>
      a.file.localeCompare(b.file) || a.kind.localeCompare(b.kind) || a.match.localeCompare(b.match)),
  }))
  .sort((a, b) => a.key.localeCompare(b.key))

const assets = [...assetMap.values()]
  .map(a => ({
    publicId: a.publicId,
    resourceType: a.resourceType,
    deliveryType: a.deliveryType,
    versions: [...a.versions].sort(),
    exts: [...a.exts].sort(),
  }))
  .sort((a, b) => a.publicId.localeCompare(b.publicId) || a.resourceType.localeCompare(b.resourceType))

const urlOccs = occurrences.filter(o => /res\.cloudinary\.com/i.test(o.match))
const imageUploadUrls = urlOccs.filter(o => o.resourceType === 'image' && o.deliveryType === 'upload')
const videoUploadUrls = urlOccs.filter(o => o.resourceType === 'video' && o.deliveryType === 'upload')
const fetchUrls = urlOccs.filter(o => o.deliveryType === 'fetch')

const uniqueFullUrls = new Set(urlOccs.map(o => o.match.split('?')[0]))
const uniqueImageUpload = new Set(
  [...uniqueFullUrls].filter(u => /\/image\/upload\//.test(u)),
)
const uniqueVideoUpload = new Set(
  [...uniqueFullUrls].filter(u => /\/video\/upload\//.test(u)),
)
const uniqueFetch = new Set(
  [...uniqueFullUrls].filter(u => /\/image\/fetch\//.test(u) || /\/video\/fetch\//.test(u)),
)

const fmOccs = occurrences.filter(o => o.kind === 'frontmatter-url' || o.kind === 'frontmatter-id')
const fmFiles = new Set(fmOccs.map(o => `${o.file}::${o.field}`))
const bodyOccs = occurrences.filter(o => o.kind === 'body-url' || o.kind === 'body-src-id')
const bodyFiles = new Set(bodyOccs.map(o => o.file))

const cropPairs = pairs.filter(p => p.crop)

const summary = {
  uniqueFullUrls: {
    imageUpload: uniqueImageUpload.size,
    videoUpload: uniqueVideoUpload.size,
    fetch: uniqueFetch.size,
    total: uniqueFullUrls.size,
  },
  frontmatter: {
    fields: fmFiles.size,
    occurrences: fmOccs.length,
  },
  body: {
    occurrences: bodyOccs.length,
    files: bodyFiles.size,
  },
  assets: {
    total: assets.length,
    image: assets.filter(a => a.resourceType === 'image').length,
    video: assets.filter(a => a.resourceType === 'video').length,
  },
  pairs: {
    total: pairs.length,
    crop: cropPairs.length,
  },
  skippedFence: skippedFence.length,
}

const inventory = {
  generatedAt: new Date().toISOString().slice(0, 10),
  baseCommit: process.env.GIT_COMMIT || null,
  summary,
  pairs,
  assets,
  occurrences: occurrences
    .map(o => ({
      file: o.file,
      kind: o.kind,
      field: o.field,
      match: o.match,
      publicId: o.publicId,
      transform: o.transform || '',
      resourceType: o.resourceType,
      deliveryType: o.deliveryType,
      version: o.version,
      ext: o.ext,
      crop: o.crop,
      fetchTarget: o.fetchTarget || null,
    }))
    .sort((a, b) =>
      a.file.localeCompare(b.file)
      || a.kind.localeCompare(b.kind)
      || a.match.localeCompare(b.match)),
  skippedFence: skippedFence
    .map(s => ({ file: s.file, match: s.match, publicId: s.publicId }))
    .sort((a, b) => a.file.localeCompare(b.file) || a.match.localeCompare(b.match)),
}

mkdirSync(outDir, { recursive: true })
const json = `${JSON.stringify(inventory, null, 2)}\n`
writeFileSync(outFile, json)

const sha = createHash('sha256').update(json).digest('hex').slice(0, 12)
console.log(JSON.stringify(summary, null, 2))
console.log(`Wrote ${relative(root, outFile)} (${json.length} bytes, sha ${sha})`)
console.log(`Skipped fence literals: ${skippedFence.length}`)
for (const s of skippedFence)
  console.log(`  - ${s.file}: ${s.match.slice(0, 80)}…`)
