#!/usr/bin/env node
/**
 * HEAD/GET every mapped Cloudinary image URL and report missing assets.
 * Also probes unmapped files under public/images (candidate public IDs).
 *
 * NOT wired into CI — keep Cloudinary bandwidth out of every Playwright/CI run (#686).
 * Run manually when changing the map or before a Vercel cutover:
 *   node scripts/verify-cloudinary-assets.mjs
 *   node scripts/verify-cloudinary-assets.mjs --json /tmp/cloudinary-verify.json
 */
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const CLOUD = 'debsobrien'
const IMAGE_BASE = `https://res.cloudinary.com/${CLOUD}/image/upload`
const UA = 'verify-cloudinary-assets/1.0'

const args = process.argv.slice(2)
const jsonOutIdx = args.indexOf('--json')
const jsonOut = jsonOutIdx >= 0 ? args[jsonOutIdx + 1] : null
const concurrency = 8

function walkImages(dir, acc = []) {
  if (!existsSync(dir))
    return acc
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name)
    if (e.isDirectory())
      walkImages(p, acc)
    else if (/\.(?:webp|png|jpe?g|gif|avif)$/i.test(e.name))
      acc.push(`/${relative(join(root, 'public'), p).replace(/\\/g, '/')}`)
  }
  return acc
}

/** Candidate public IDs for a local path that is not in the map. */
function guessPublicIds(localPath) {
  const noExt = localPath.replace(/\.[^/.]+$/, '').replace(/^\/images\//, '')
  const base = noExt.split('/').pop() || noExt
  return [
    `debbie.codes/${noExt}`,
    `debbie.codes/${base}`,
    noExt,
    base,
  ]
}

async function probe(url) {
  try {
    let res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      headers: { 'user-agent': UA },
    })
    // Some CDNs dislike HEAD — fall back to GET range.
    if (res.status === 405 || res.status === 403) {
      res = await fetch(url, {
        method: 'GET',
        redirect: 'follow',
        headers: { 'user-agent': UA, 'range': 'bytes=0-0' },
      })
    }
    const ct = (res.headers.get('content-type') || '').split(';')[0].trim()
    return { ok: res.ok, status: res.status, contentType: ct, url }
  }
  catch (err) {
    return { ok: false, status: 0, contentType: '', url, error: err.message }
  }
}

async function mapPool(items, limit, fn) {
  const results = Array.from({ length: items.length })
  let i = 0
  async function worker() {
    while (i < items.length) {
      const idx = i++
      results[idx] = await fn(items[idx], idx)
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, () => worker()))
  return results
}

function deliveryUrl(publicId, transforms = 'f_auto,q_auto') {
  return `${IMAGE_BASE}/${transforms}/${publicId.replace(/^\//, '')}`
}

async function main() {
  const mapPath = join(root, 'utils/cloudinary-public-ids.json')
  const map = JSON.parse(readFileSync(mapPath, 'utf8'))
  /** @type {Record<string, string>} */
  const images = map.images || {}

  const mappedEntries = Object.entries(images).map(([localPath, publicId]) => ({
    localPath,
    publicId,
    kind: 'mapped',
  }))

  const publicFiles = walkImages(join(root, 'public/images'))
  const unmapped = publicFiles.filter(p => !images[p])

  console.log(`Mapped image IDs: ${mappedEntries.length}`)
  console.log(`Unmapped public/images files: ${unmapped.length}`)
  console.log(`Probing Cloudinary (concurrency ${concurrency})…`)
  console.log('')

  const mappedResults = await mapPool(mappedEntries, concurrency, async (entry) => {
    const url = deliveryUrl(entry.publicId)
    const result = await probe(url)
    return { ...entry, ...result, tried: [entry.publicId] }
  })

  const mappedOk = mappedResults.filter(r => r.ok)
  const mappedMissing = mappedResults.filter(r => !r.ok)

  console.log(`Mapped OK: ${mappedOk.length}`)
  console.log(`Mapped missing/fail: ${mappedMissing.length}`)
  if (mappedMissing.length) {
    console.log('\n## Mapped assets missing on Cloudinary')
    for (const r of mappedMissing) {
      console.log(`- ${r.localPath} → ${r.publicId} (HTTP ${r.status}${r.error ? ` ${r.error}` : ''})`)
      console.log(`  ${r.url}`)
    }
  }

  // For unmapped local files, try a few public-id guesses — list rather than invent replacements.
  console.log('\nProbing unmapped local files for accidental Cloudinary hits…')
  const unmappedResults = await mapPool(unmapped, concurrency, async (localPath) => {
    const guesses = guessPublicIds(localPath)
    /** @type {Array<{ publicId: string, ok: boolean, status: number, url: string }>} */
    const tried = []
    for (const publicId of guesses) {
      const url = deliveryUrl(publicId)
      const result = await probe(url)
      tried.push({ publicId, ok: result.ok, status: result.status, url })
      if (result.ok)
        return { localPath, found: publicId, tried, ok: true }
    }
    return { localPath, found: null, tried, ok: false }
  })

  const unmappedFound = unmappedResults.filter(r => r.ok)
  const unmappedMissing = unmappedResults.filter(r => !r.ok)

  if (unmappedFound.length) {
    console.log('\n## Unmapped local files that DO exist on Cloudinary (add to map)')
    for (const r of unmappedFound)
      console.log(`- ${r.localPath} → ${r.found}`)
  }

  console.log('\n## Unmapped local files with no Cloudinary match (static fallback on Vercel)')
  for (const r of unmappedMissing)
    console.log(`- ${r.localPath}`)

  const report = {
    generatedAt: new Date().toISOString(),
    cloudName: CLOUD,
    mapped: {
      total: mappedResults.length,
      ok: mappedOk.length,
      missing: mappedMissing.map(r => ({
        localPath: r.localPath,
        publicId: r.publicId,
        status: r.status,
        url: r.url,
      })),
    },
    unmapped: {
      total: unmapped.length,
      foundOnCloudinary: unmappedFound.map(r => ({ localPath: r.localPath, publicId: r.found })),
      missingOnCloudinary: unmappedMissing.map(r => r.localPath),
    },
  }

  if (jsonOut) {
    writeFileSync(jsonOut, `${JSON.stringify(report, null, 2)}\n`)
    console.log(`\nWrote ${jsonOut}`)
  }

  // Exit 1 only when a mapped ID 404s — those break Vercel NuxtImg/OG.
  process.exit(mappedMissing.length ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
