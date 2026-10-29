#!/usr/bin/env node
/**
 * Convert cached Cloudinary downloads → public/images/content/**
 * Images: WebP q90 (lossless for alpha/≤256-colour), max 1800px wide.
 * HEIC → WebP. GIF → muted looping MP4 + poster.
 * Video → H.264 MP4 ≤1280px + poster JPEG.
 * Budget: images ≤25MB, video+audio ≤40MB.
 */
import { execFileSync } from 'node:child_process'
import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import sharp from 'sharp'
import {
  localPublicPath,
} from './parse.mjs'

const root = fileURLToPath(new URL('../..', import.meta.url))
const manifestPath = join(root, 'scripts/cloudinary/manifest.json')
const outRoot = join(root, 'public/images/content')
/** Post-optimize totals (~21.4 / ~22.0 MB) + ~10% headroom. */
const IMAGE_BUDGET = Math.round(23.5 * 1024 * 1024)
const MEDIA_BUDGET = Math.round(24.2 * 1024 * 1024)
/** 2× body column (818px) with a little headroom; plan default was 1800. */
const MAX_IMAGE_W = 1640
const MAX_VIDEO_W = 960
/** Photos re-encoded around q75–78 in the follow-up optimize pass; convert default kept conservative. */
const WEBP_QUALITY = 78

mkdirSync(outRoot, { recursive: true })

const manifest = JSON.parse(readFileSync(manifestPath, 'utf8'))

function ensureDir(p) {
  mkdirSync(dirname(p), { recursive: true })
}

function fileTypeHint(entry, cachePath) {
  const ext = (entry.originalFormat || entry.ext || cachePath.split('.').pop() || '').toLowerCase()
  const id = entry.publicId.toLowerCase()
  if (entry.conversion === 'youtube-thumb-direct')
    return 'skip'
  if (ext === 'mp3' || id.endsWith('.mp3'))
    return 'audio'
  if (ext === 'mp4' || ext === 'webm' || ext === 'mov' || (entry.resourceType === 'video' && !['jpg', 'jpeg', 'png', 'webp', 'gif', 'heic'].includes(ext)))
    return 'video'
  if (ext === 'gif' || id.endsWith('.gif'))
    return 'gif'
  if (ext === 'heic' || id.endsWith('.heic'))
    return 'heic'
  // video/upload of jpg posters
  if (entry.resourceType === 'video' && ['jpg', 'jpeg', 'png', 'webp'].includes(ext))
    return 'image'
  return 'image'
}

async function fetchJpgFallback(entry) {
  const ver = entry.version ? `v${entry.version}/` : ''
  const id = entry.publicId
  // Prefer keeping .heic suffix when the delivery URL used it; else bare id.
  const candidates = [
    `https://res.cloudinary.com/debsobrien/image/upload/f_jpg,q_95/${ver}${id}.heic`,
    `https://res.cloudinary.com/debsobrien/image/upload/f_jpg,q_95/${ver}${id}`,
  ]
  const dest = `${entry.cachePath}.f_jpg_q95.jpg`
  if (existsSync(dest) && statSync(dest).size > 1000)
    return dest
  for (const tryUrl of candidates) {
    try {
      console.log(`  HEIC fallback: ${tryUrl}`)
      const res = await fetch(tryUrl, { redirect: 'follow' })
      if (!res.ok)
        continue
      const buf = Buffer.from(await res.arrayBuffer())
      if (buf.length < 1000)
        continue
      writeFileSync(dest, buf)
      return dest
    }
    catch { /* try next */ }
  }
  throw new Error(`HEIC fallback failed for ${entry.publicId}`)
}

async function convertImage(entry, cachePath, freezeCrop) {
  let input = cachePath
  const hint = fileTypeHint(entry, cachePath)

  if (hint === 'heic') {
    const jpgTmp = `${cachePath}.srgb.jpg`
    let ok = false
    try {
      execFileSync('heif-convert', ['-q', '95', cachePath, jpgTmp], { stdio: 'pipe' })
      // Prove decode works end-to-end before accepting
      await sharp(jpgTmp, { failOn: 'none' }).resize(8).webp().toBuffer()
      input = jpgTmp
      ok = true
    }
    catch { /* codec missing */ }
    if (!ok) {
      try {
        await sharp(cachePath, { failOn: 'error' }).resize(8).webp().toBuffer()
        input = cachePath
        ok = true
      }
      catch { /* still no */ }
    }
    if (!ok)
      input = await fetchJpgFallback(entry)
  }

  let meta
  try {
    meta = await sharp(input, { failOn: 'none', animated: false }).metadata()
  }
  catch (err) {
    if (hint !== 'heic') {
      // Cached original may still be HEIC despite missing extension
      input = await fetchJpgFallback(entry)
      meta = await sharp(input, { failOn: 'none' }).metadata()
    }
    else {
      throw err
    }
  }

  const width = meta.width || entry.originalWidth || 0
  let pipeline = sharp(input, { failOn: 'none', animated: false }).rotate()
  if (width > MAX_IMAGE_W) {
    pipeline = sharp(input, { failOn: 'none' }).rotate().resize({
      width: MAX_IMAGE_W,
      withoutEnlargement: true,
    })
  }
  pipeline = pipeline.toColorspace('srgb')

  const hasAlpha = Boolean(meta.hasAlpha)
  const isScreenshotLike = hasAlpha || meta.format === 'png'

  const outRel = localPublicPath({
    publicId: entry.publicId,
    transform: freezeCrop ? (entry.downloadTransform || entry.transform) : '',
    freezeCrop,
    outExt: 'webp',
  })
  const finalAbs = join(root, 'public', outRel.slice(1))
  ensureDir(finalAbs)

  let outBuf
  let conversion = `webp-q${WEBP_QUALITY}`

  if (isScreenshotLike) {
    const lossy = await pipeline.clone().webp({ quality: WEBP_QUALITY, effort: 5, smartSubsample: true }).toBuffer()
    const lossless = await pipeline.clone().webp({ lossless: true, effort: 5 }).toBuffer()
    if (lossless.length <= lossy.length) {
      outBuf = lossless
      conversion = 'webp-lossless'
    }
    else {
      outBuf = lossy
      conversion = `webp-q${WEBP_QUALITY}-picked-over-lossless`
    }
  }
  else {
    outBuf = await pipeline.webp({ quality: WEBP_QUALITY, effort: 5, smartSubsample: true }).toBuffer()
  }

  writeFileSync(finalAbs, outBuf)
  const outMeta = await sharp(outBuf).metadata()

  return {
    localPath: outRel,
    outBytes: outBuf.length,
    outWidth: outMeta.width,
    outHeight: outMeta.height,
    outFormat: 'webp',
    conversion: hint === 'heic' ? `${conversion}+heic` : conversion,
  }
}

async function convertGif(entry, cachePath) {
  const baseRel = localPublicPath({
    publicId: entry.publicId,
    transform: '',
    freezeCrop: false,
    outExt: 'mp4',
  })
  const mp4Abs = join(root, 'public', baseRel.slice(1))
  const posterRel = baseRel.replace(/\.mp4$/, '-poster.jpg')
  const posterAbs = join(root, 'public', posterRel.slice(1))
  ensureDir(mp4Abs)

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    cachePath,
    '-vf',
    `scale='min(${MAX_VIDEO_W},iw)':-2`,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-an',
    '-crf',
    '23',
    mp4Abs,
  ], { stdio: 'pipe' })

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    cachePath,
    '-frames:v',
    '1',
    '-vf',
    `scale='min(${MAX_VIDEO_W},iw)':-2`,
    '-q:v',
    '2',
    posterAbs,
  ], { stdio: 'pipe' })

  const posterMeta = await sharp(posterAbs).metadata()
  return {
    localPath: baseRel,
    posterPath: posterRel,
    outBytes: statSync(mp4Abs).size,
    outWidth: posterMeta.width,
    outHeight: posterMeta.height,
    outFormat: 'mp4',
    conversion: 'gif-to-mp4',
  }
}

async function convertVideo(entry, cachePath) {
  const baseRel = localPublicPath({
    publicId: entry.publicId,
    transform: '',
    freezeCrop: false,
    outExt: 'mp4',
  })
  const mp4Abs = join(root, 'public', baseRel.slice(1))
  const posterRel = baseRel.replace(/\.mp4$/, '-poster.jpg')
  const posterAbs = join(root, 'public', posterRel.slice(1))
  ensureDir(mp4Abs)

  // If source is already an image poster under video/upload, treat as image
  const head = readFileSync(cachePath).subarray(0, 12)
  const isJpeg = head[0] === 0xFF && head[1] === 0xD8
  const isPng = head[0] === 0x89 && head[1] === 0x50
  if (isJpeg || isPng) {
    return convertImage({ ...entry, resourceType: 'image' }, cachePath, false)
  }

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    cachePath,
    '-vf',
    `scale='min(${MAX_VIDEO_W},iw)':-2`,
    '-c:v',
    'libx264',
    '-pix_fmt',
    'yuv420p',
    '-movflags',
    '+faststart',
    '-c:a',
    'aac',
    '-b:a',
    '128k',
    '-crf',
    '23',
    mp4Abs,
  ], { stdio: 'pipe' })

  execFileSync('ffmpeg', [
    '-y',
    '-i',
    cachePath,
    '-ss',
    '0',
    '-frames:v',
    '1',
    '-vf',
    `scale='min(${MAX_VIDEO_W},iw)':-2`,
    '-q:v',
    '3',
    posterAbs,
  ], { stdio: 'pipe' })

  let w = null
  let h = null
  try {
    const posterMeta = await sharp(posterAbs).metadata()
    w = posterMeta.width
    h = posterMeta.height
  }
  catch { /* ignore */ }

  const bytes = statSync(mp4Abs).size
  if (bytes > 10 * 1024 * 1024)
    console.warn(`WARN video >10MB: ${baseRel} (${(bytes / 1024 / 1024).toFixed(1)} MB)`)

  return {
    localPath: baseRel,
    posterPath: posterRel,
    outBytes: bytes,
    outWidth: w,
    outHeight: h,
    outFormat: 'mp4',
    conversion: 'h264-mp4',
  }
}

function convertAudio(entry, cachePath) {
  const baseRel = localPublicPath({
    publicId: entry.publicId,
    transform: '',
    freezeCrop: false,
    outExt: 'mp3',
  })
  const abs = join(root, 'public', baseRel.slice(1))
  ensureDir(abs)
  copyFileSync(cachePath, abs)
  return {
    localPath: baseRel,
    outBytes: statSync(abs).size,
    outWidth: null,
    outHeight: null,
    outFormat: 'mp3',
    conversion: 'copy-mp3',
  }
}

const updated = []
const countedPaths = new Set()
let imageBytes = 0
let mediaBytes = 0

function addUniqueBytes(relPath, bytes, kind) {
  if (!relPath || countedPaths.has(relPath))
    return
  countedPaths.add(relPath)
  if (kind === 'media')
    mediaBytes += bytes
  else
    imageBytes += bytes
}

for (const entry of manifest.entries) {
  if (entry.skipDownload || entry.conversion === 'youtube-thumb-direct') {
    updated.push({ ...entry, localPath: entry.sourceUrl || entry.localPath, conversion: 'youtube-thumb-direct' })
    continue
  }
  if (!entry.cachePath || !existsSync(entry.cachePath)) {
    console.error(`Missing cache for ${entry.key}`)
    process.exit(1)
  }

  const freezeCrop = Boolean(entry.crop)
  const hint = fileTypeHint(entry, entry.cachePath)
  console.log(`convert [${hint}] ${entry.publicId}`)

  let result
  try {
    if (hint === 'audio')
      result = convertAudio(entry, entry.cachePath)
    else if (hint === 'gif')
      result = await convertGif(entry, entry.cachePath)
    else if (hint === 'video')
      result = await convertVideo(entry, entry.cachePath)
    else
      result = await convertImage(entry, entry.cachePath, freezeCrop)
  }
  catch (err) {
    console.error(`FAIL ${entry.key}: ${err.message}`)
    process.exit(1)
  }

  const next = { ...entry, ...result }
  updated.push(next)

  const kind = (result.outFormat === 'mp4' || result.outFormat === 'mp3') ? 'media' : 'image'
  addUniqueBytes(result.localPath, result.outBytes, kind)
  if (result.posterPath) {
    const posterAbs = join(root, 'public', result.posterPath.slice(1))
    if (existsSync(posterAbs))
      addUniqueBytes(result.posterPath, statSync(posterAbs).size, 'media')
  }
}

manifest.entries = updated.sort((a, b) => a.key.localeCompare(b.key))
manifest.convertedAt = new Date().toISOString()
manifest.totals = {
  imageBytes,
  mediaBytes,
  imageMB: +(imageBytes / 1024 / 1024).toFixed(2),
  mediaMB: +(mediaBytes / 1024 / 1024).toFixed(2),
}
writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(`Images: ${manifest.totals.imageMB} MB (budget ${(IMAGE_BUDGET / 1024 / 1024).toFixed(1)})`)
console.log(`Video+audio: ${manifest.totals.mediaMB} MB (budget ${(MEDIA_BUDGET / 1024 / 1024).toFixed(1)})`)

if (imageBytes > IMAGE_BUDGET || mediaBytes > MEDIA_BUDGET) {
  console.error('BUDGET EXCEEDED — top 10 by size:')
  const ranked = [...updated]
    .filter(e => e.outBytes)
    .sort((a, b) => b.outBytes - a.outBytes)
    .slice(0, 10)
  for (const e of ranked)
    console.error(`  ${(e.outBytes / 1024).toFixed(0)} KB  ${e.localPath}  (${e.conversion})`)
  process.exit(2)
}

console.log('Convert OK')
