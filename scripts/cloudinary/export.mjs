#!/usr/bin/env node
/**
 * Idempotent Cloudinary export → .cache/cloudinary/ + scripts/cloudinary/manifest.json
 * Usage: node scripts/cloudinary/export.mjs
 * Concurrency 4, retry ×3. Skips when sha256 already matches.
 */
import { execFileSync } from 'node:child_process'
import { createHash } from 'node:crypto'
import { createWriteStream, existsSync, mkdirSync, readFileSync, renameSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { Readable } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { fileURLToPath } from 'node:url'
import {
  buildDownloadUrl,
  enlargeCropTransform,
  isCropTransform,
  publicIdToRelPath,
  transformSlug,
} from './parse.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const inventoryPath = join(root, 'scripts/cloudinary/inventory.json')
const manifestPath = join(root, 'scripts/cloudinary/manifest.json')
const cacheDir = join(root, '.cache/cloudinary')

const CONCURRENCY = 4
const RETRIES = 3

mkdirSync(cacheDir, { recursive: true })

const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'))
let manifest = { entries: [], downloadedBytes: 0, generatedAt: null }
if (existsSync(manifestPath)) {
  try {
    manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))
  }
  catch { /* fresh */ }
}

const byKey = new Map((manifest.entries || []).map(e => [e.key, e]))

function sha256File(path) {
  const h = createHash('sha256')
  h.update(readFileSync(path))
  return h.digest('hex')
}

function cachePathFor(pair, downloadTransform) {
  const rel = publicIdToRelPath(pair.publicId).replace(/[^\w./-]+/g, '_')
  const slug = downloadTransform ? `--${transformSlug(downloadTransform)}` : ''
  const ext = pair.ext || (pair.resourceType === 'video' ? 'mp4' : 'bin')
  // fetch special
  if (pair.deliveryType === 'fetch')
    return join(cacheDir, `fetch/${createHash('sha1').update(pair.fetchTarget || pair.publicId).digest('hex')}.bin`)
  return join(cacheDir, `${pair.resourceType}/${rel}${slug}.${ext}`)
}

async function download(url, dest) {
  mkdirSync(dirname(dest), { recursive: true })
  const tmp = `${dest}.part`
  let lastErr
  for (let i = 0; i < RETRIES; i++) {
    try {
      const res = await fetch(url, {
        headers: { 'User-Agent': 'debbie.codes-cloudinary-export/1.0' },
        redirect: 'follow',
      })
      if (!res.ok)
        throw new Error(`HTTP ${res.status} for ${url}`)
      if (!res.body)
        throw new Error(`No body for ${url}`)
      await pipeline(Readable.fromWeb(res.body), createWriteStream(tmp))
      renameSync(tmp, dest)
      return statSync(dest).size
    }
    catch (err) {
      lastErr = err
      const wait = 500 * 2 ** i
      console.warn(`retry ${i + 1}/${RETRIES} ${url}: ${err.message} (wait ${wait}ms)`)
      await new Promise(r => setTimeout(r, wait))
    }
  }
  throw lastErr
}

function probeDims(filePath, resourceType, ext) {
  const lower = (ext || filePath.split('.').pop() || '').toLowerCase()
  if (resourceType === 'video' || ['mp4', 'webm', 'mov', 'mp3', 'ogg', 'm4a'].includes(lower)) {
    try {
      const out = execFileSync('ffprobe', [
        '-v',
        'error',
        '-select_streams',
        'v:0',
        '-show_entries',
        'stream=width,height',
        '-of',
        'csv=p=0',
        filePath,
      ], { encoding: 'utf8', timeout: 15000 }).trim()
      const [w, h] = out.split(',').map(Number)
      return { width: w || null, height: h || null, format: lower || 'mp4' }
    }
    catch {
      return { width: null, height: null, format: lower || null }
    }
  }
  try {
    const out = execFileSync('identify', ['-ping', '-format', '%w %h %m', filePath], {
      encoding: 'utf8',
      timeout: 10000,
    }).trim()
    const [w, h, format] = out.split(/\s+/)
    return { width: Number(w) || null, height: Number(h) || null, format: (format || '').toLowerCase() }
  }
  catch {
    return { width: null, height: null, format: lower || null }
  }
}

// Build work list
const jobs = []
for (const pair of inventory.pairs) {
  // Fetch → YouTube thumb: do not download from Cloudinary
  if (pair.deliveryType === 'fetch') {
    const yt = pair.fetchTarget?.includes('J3djzf5bMEs')
      ? 'https://i.ytimg.com/vi/J3djzf5bMEs/hqdefault.jpg'
      : pair.fetchTarget
    byKey.set(pair.key, {
      key: pair.key,
      publicId: pair.publicId,
      transform: pair.transform,
      resourceType: pair.resourceType,
      deliveryType: 'fetch',
      sourceUrl: yt,
      originalBytes: 0,
      originalFormat: 'jpg',
      originalWidth: 480,
      originalHeight: 360,
      sha256: null,
      cachePath: null,
      localPath: yt.startsWith('http') ? yt : null,
      outBytes: null,
      outWidth: null,
      outHeight: null,
      outFormat: null,
      conversion: 'youtube-thumb-direct',
      skipDownload: true,
    })
    continue
  }

  const crop = pair.crop || isCropTransform(pair.transform)
  const downloadTransform = crop ? enlargeCropTransform(pair.transform) : ''
  // For plain assets, download original without transforms
  const sourceUrl = buildDownloadUrl({
    resourceType: pair.resourceType,
    deliveryType: pair.deliveryType,
    version: pair.version || (pair.occurrences?.[0] && null),
    publicId: pair.publicId,
    ext: pair.ext,
    transform: downloadTransform,
  })

  // Prefer highest version seen on the pair
  let version = pair.version
  if (!version) {
    // Try to recover from occurrences' match URLs
    for (const occ of pair.occurrences || []) {
      const vm = String(occ.match).match(/\/v(\d+)\//)
      if (vm) {
        version = vm[1]
        break
      }
    }
  }

  const url = buildDownloadUrl({
    resourceType: pair.resourceType,
    deliveryType: pair.deliveryType,
    version,
    publicId: pair.publicId,
    ext: pair.ext,
    transform: downloadTransform,
  })

  const dest = cachePathFor(pair, downloadTransform)
  const existing = byKey.get(pair.key)
  if (existing?.sha256 && existing.cachePath && existsSync(join(root, existing.cachePath.replace(/^\//, '')) || existing.cachePath)) {
    const abs = existing.cachePath.startsWith('/') ? existing.cachePath : join(root, existing.cachePath)
    // cache paths are absolute under .cache
  }
  if (existing?.sha256 && existing.cachePath && existsSync(existing.cachePath)) {
    const hash = sha256File(existing.cachePath)
    if (hash === existing.sha256) {
      console.log(`skip ${pair.key}`)
      continue
    }
  }
  if (existsSync(dest) && existing?.sha256) {
    const hash = sha256File(dest)
    if (hash === existing.sha256) {
      console.log(`skip ${pair.key}`)
      continue
    }
  }
  if (existsSync(dest)) {
    const hash = sha256File(dest)
    if (existing?.sha256 === hash) {
      console.log(`skip ${pair.key}`)
      continue
    }
    const dims = probeDims(dest, pair.resourceType, pair.ext)
    byKey.set(pair.key, {
      key: pair.key,
      publicId: pair.publicId,
      transform: pair.transform || '',
      downloadTransform,
      resourceType: pair.resourceType,
      deliveryType: pair.deliveryType,
      version,
      sourceUrl: url,
      originalBytes: statSync(dest).size,
      originalFormat: dims.format || pair.ext,
      originalWidth: dims.width,
      originalHeight: dims.height,
      sha256: hash,
      cachePath: dest,
      localPath: null,
      outBytes: null,
      outWidth: null,
      outHeight: null,
      outFormat: null,
      conversion: null,
      crop,
    })
    console.log(`reuse cache ${pair.key}`)
    continue
  }

  jobs.push({ pair, url, dest, downloadTransform, version, crop })
}

console.log(`Jobs to download: ${jobs.length}`)

let downloadedBytes = 0
const failures = []
let idx = 0

async function worker() {
  while (idx < jobs.length) {
    const i = idx++
    const job = jobs[i]
    try {
      console.log(`[${i + 1}/${jobs.length}] ${job.url}`)
      const bytes = await download(job.url, job.dest)
      downloadedBytes += bytes
      const hash = sha256File(job.dest)
      const dims = probeDims(job.dest, job.pair.resourceType, job.pair.ext)
      byKey.set(job.pair.key, {
        key: job.pair.key,
        publicId: job.pair.publicId,
        transform: job.pair.transform || '',
        downloadTransform: job.downloadTransform,
        resourceType: job.pair.resourceType,
        deliveryType: job.pair.deliveryType,
        version: job.version,
        sourceUrl: job.url,
        originalBytes: bytes,
        originalFormat: dims.format || job.pair.ext,
        originalWidth: dims.width,
        originalHeight: dims.height,
        sha256: hash,
        cachePath: job.dest,
        localPath: null,
        outBytes: null,
        outWidth: null,
        outHeight: null,
        outFormat: null,
        conversion: null,
        crop: job.crop,
      })
    }
    catch (err) {
      failures.push({ key: job.pair.key, url: job.url, error: err.message })
      console.error(`FAIL ${job.pair.key}: ${err.message}`)
    }
  }
}

await Promise.all(Array.from({ length: CONCURRENCY }, () => worker()))

manifest = {
  generatedAt: new Date().toISOString(),
  downloadedBytesThisRun: downloadedBytes,
  entries: [...byKey.values()].sort((a, b) => a.key.localeCompare(b.key)),
  failures,
}

writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)
console.log(`Downloaded ${downloadedBytes} bytes this run`)
console.log(`Manifest entries: ${manifest.entries.length}`)
console.log(`Failures: ${failures.length}`)
if (failures.length) {
  for (const f of failures)
    console.error(`  - ${f.key}: ${f.error}`)
  process.exit(1)
}
