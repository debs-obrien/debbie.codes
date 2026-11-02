#!/usr/bin/env node
/**
 * One-shot image/media optimization for the Cloudinary→Netlify migration follow-up.
 * Safe to re-run; only writes when the new file is smaller.
 */
import { createRequire } from 'node:module'
import { execFileSync } from 'node:child_process'
import { copyFileSync, readdirSync, readFileSync, renameSync, statSync, unlinkSync, writeFileSync } from 'node:fs'
import { dirname, extname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'

const require = createRequire(import.meta.url)
const sharp = require('sharp')

const root = fileURLToPath(new URL('..', import.meta.url))
const imagesRoot = join(root, 'public/images')
const report = {
  before: {},
  after: {},
  actions: [],
  webpOver200Reasons: [],
  skipped: [],
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = join(dir, e.name)
    return e.isDirectory() ? walk(p) : [p]
  })
}

function bytesOf(paths) {
  return paths.reduce((n, p) => n + statSync(p).size, 0)
}

function listAssets() {
  const all = walk(imagesRoot)
  const images = all.filter(p => /\.(webp|png|jpe?g|svg|gif)$/i.test(p))
  const media = all.filter(p => /\.(mp4|mp3|webm)$/i.test(p))
  const contentImages = images.filter(p => p.includes(`${imagesRoot}/content/`))
  const contentMedia = media.filter(p => p.includes(`${imagesRoot}/content/`))
  return { images, media, contentImages, contentMedia }
}

function snapshot(label) {
  const a = listAssets()
  report[label] = {
    allImagesMB: +(bytesOf(a.images) / 1024 / 1024).toFixed(2),
    allMediaMB: +(bytesOf(a.media) / 1024 / 1024).toFixed(2),
    contentImagesMB: +(bytesOf(a.contentImages) / 1024 / 1024).toFixed(2),
    contentMediaMB: +(bytesOf(a.contentMedia) / 1024 / 1024).toFixed(2),
    imageCount: a.images.length,
    mediaCount: a.media.length,
  }
  return a
}

function isLikelyScreenshot(path) {
  const name = path.toLowerCase()
  return /screenshot|clean.?shot|vscode|codegen|waterfall|figma|terminal|json-editor|intent|invocation|mcp|bit_|_2x_|component|dependency|rating|heading|product-details|shoe-store|import-component|variables|manifest|lighthouse|inspect|install|lock-deploy|netlify|pwa|tailwind|vue-plugins|graphql|apollo|playlist/.test(name)
}

async function optimizeWebp(file) {
  const before = statSync(file).size
  if (before < 80 * 1024)
    return
  const img = sharp(file, { failOn: 'none' })
  const meta = await img.metadata()
  const w = meta.width || 0
  const h = meta.height || 0
  const screenshot = isLikelyScreenshot(file)
  // Body prose max CSS ~820px → 2× = 1640. Covers/list ≤640 CSS → keep ≤1280 when unused at full width.
  let targetW = w
  if (w > 1640)
    targetW = 1640

  const pipeline = sharp(file, { failOn: 'none' }).rotate()
  if (targetW < w)
    pipeline.resize({ width: targetW, withoutEnlargement: true })

  const tmpLossy = join(tmpdir(), `opt-lossy-${process.pid}-${Math.random().toString(36).slice(2)}.webp`)
  const tmpLossless = join(tmpdir(), `opt-ll-${process.pid}-${Math.random().toString(36).slice(2)}.webp`)

  const quality = screenshot ? 82 : (before > 400 * 1024 ? 75 : 78)
  await pipeline.clone().webp({ quality, effort: 6, smartSubsample: true }).toFile(tmpLossy)
  let best = tmpLossy
  let bestBytes = statSync(tmpLossy).size

  if (screenshot) {
    try {
      await sharp(file, { failOn: 'none' })
        .rotate()
        .resize(targetW < w ? { width: targetW, withoutEnlargement: true } : undefined)
        .webp({ lossless: true, effort: 6 })
        .toFile(tmpLossless)
      const ll = statSync(tmpLossless).size
      if (ll < bestBytes) {
        best = tmpLossless
        bestBytes = ll
      }
      else {
        unlinkSync(tmpLossless)
      }
    }
    catch {
      try { unlinkSync(tmpLossless) }
      catch { /* ignore */ }
    }
  }

  if (bestBytes < before * 0.98) {
    copyFileSync(best, file)
    report.actions.push({
      type: 'webp-reencode',
      file: relative(root, file),
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(bestBytes / 1024).toFixed(1),
      quality: best === tmpLossless ? 'lossless' : quality,
      dims: `${w}x${h}${targetW < w ? `→${targetW}` : ''}`,
      kind: screenshot ? 'screenshot' : 'photo',
    })
  }
  else {
    report.skipped.push({ file: relative(root, file), reason: 'reencode not smaller', beforeKB: +(before / 1024).toFixed(1) })
  }
  try { unlinkSync(tmpLossy) }
  catch { /* ignore */ }
  try { unlinkSync(tmpLossless) }
  catch { /* ignore */ }
}

async function optimizePng(file) {
  const before = statSync(file).size
  const img = sharp(file, { failOn: 'none' })
  const meta = await img.metadata()
  const w = meta.width || 0
  // Blog body / covers: cap at 1640; ken cards are 1920 display cinema → keep ≤1280 for inline
  let targetW = w
  if (/ken-50th-birthday-video/.test(file) && w > 1280)
    targetW = 1280
  else if (/\/covers\//.test(file) && w > 1200)
    targetW = 1200
  else if (w > 1640)
    targetW = 1640

  const tmpWebp = join(tmpdir(), `opt-png-${process.pid}-${Math.random().toString(36).slice(2)}.webp`)
  const tmpPng = join(tmpdir(), `opt-png-${process.pid}-${Math.random().toString(36).slice(2)}.png`)
  const screenshot = isLikelyScreenshot(file) || /grok-bot|alexa|covers/.test(file)

  let pipe = sharp(file, { failOn: 'none' }).rotate()
  if (targetW < w)
    pipe = pipe.resize({ width: targetW, withoutEnlargement: true })

  await pipe.clone().webp({ quality: screenshot ? 82 : 78, effort: 6 }).toFile(tmpWebp)
  await pipe.clone().png({ compressionLevel: 9, palette: false }).toFile(tmpPng)

  const webpBytes = statSync(tmpWebp).size
  const pngBytes = statSync(tmpPng).size

  // Prefer rewriting to .webp when substantially smaller and file is referenced as local path we can update.
  const webpPath = file.replace(/\.png$/i, '.webp')
  if (webpBytes < before * 0.7 && webpBytes < pngBytes) {
    copyFileSync(tmpWebp, webpPath)
    // Keep original PNG only if still referenced; we'll rewrite content refs and delete if unused later.
    report.actions.push({
      type: 'png-to-webp',
      file: relative(root, file),
      out: relative(root, webpPath),
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(webpBytes / 1024).toFixed(1),
      dims: `${w}x${meta.height}${targetW < w ? `→${targetW}` : ''}`,
    })
  }
  else if (pngBytes < before * 0.95) {
    copyFileSync(tmpPng, file)
    report.actions.push({
      type: 'png-compress',
      file: relative(root, file),
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(pngBytes / 1024).toFixed(1),
      dims: `${w}x${meta.height}${targetW < w ? `→${targetW}` : ''}`,
    })
  }
  unlinkSync(tmpWebp)
  unlinkSync(tmpPng)
}

async function resizeAvatar() {
  const file = join(imagesRoot, 'debbie-thumb.webp')
  const before = statSync(file).size
  const tmp = join(tmpdir(), 'debbie-thumb-opt.webp')
  // Displayed at 112–160 CSS px → 2× = 320
  await sharp(file).resize({ width: 320, height: 320, fit: 'cover' }).webp({ quality: 80, effort: 6 }).toFile(tmp)
  const after = statSync(tmp).size
  if (after < before) {
    copyFileSync(tmp, file)
    report.actions.push({ type: 'avatar-resize', file: 'public/images/debbie-thumb.webp', beforeKB: +(before / 1024).toFixed(1), afterKB: +(after / 1024).toFixed(1), dims: '512→320' })
  }
  unlinkSync(tmp)
}

function optimizeVideo(file) {
  const before = statSync(file).size
  const rel = relative(root, file)
  const tmp = join(tmpdir(), `opt-vid-${process.pid}-${Math.random().toString(36).slice(2)}.mp4`)
  // Body videos display ≤820 CSS (~100vw lg:820). Cap encode width at 960.
  // Tiny GIF loops keep native width.
  let scale = 'scale=\'min(960,iw)\':-2'
  if (/counter-couting|select-on-change/.test(file))
    scale = 'scale=iw:ih' // already small

  try {
    execFileSync('ffmpeg', [
      '-y', '-i', file,
      '-an',
      '-c:v', 'libx264',
      '-pix_fmt', 'yuv420p',
      '-preset', 'slow',
      '-crf', '28',
      '-vf', scale,
      '-movflags', '+faststart',
      tmp,
    ], { stdio: 'pipe' })
  }
  catch (err) {
    report.skipped.push({ file: rel, reason: `ffmpeg failed: ${err.message}` })
    try { unlinkSync(tmp) }
    catch { /* ignore */ }
    return
  }
  const after = statSync(tmp).size
  if (after < before * 0.98) {
    copyFileSync(tmp, file)
    report.actions.push({
      type: 'video-reencode',
      file: rel,
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(after / 1024).toFixed(1),
    })
  }
  else {
    report.skipped.push({ file: rel, reason: 'video reencode not smaller', beforeKB: +(before / 1024).toFixed(1) })
  }
  unlinkSync(tmp)
}

async function optimizeOgCards() {
  for (const name of ['x-card.png', 'twitter-card.png', 'x-card-blog.png']) {
    const file = join(root, 'public', name)
    try { statSync(file) }
    catch { continue }
    const before = statSync(file).st_size
    const outJpg = file.replace(/\.png$/i, '.jpg')
    const tmp = join(tmpdir(), `og-${name}.jpg`)
    await sharp(file)
      .resize({ width: 1200, height: 630, fit: 'cover' })
      .jpeg({ quality: 82, mozjpeg: true })
      .toFile(tmp)
    let q = 82
    let size = statSync(tmp).size
    while (size > 300 * 1024 && q > 60) {
      q -= 4
      await sharp(file).resize({ width: 1200, height: 630, fit: 'cover' }).jpeg({ quality: q, mozjpeg: true }).toFile(tmp)
      size = statSync(tmp).size
    }
    copyFileSync(tmp, outJpg)
    report.actions.push({
      type: 'og-jpeg',
      file: relative(root, file),
      out: relative(root, outJpg),
      beforeKB: +(before / 1024).toFixed(1),
      afterKB: +(size / 1024).toFixed(1),
      quality: q,
    })
    unlinkSync(tmp)
  }
}

function rewritePngRefsToWebp(conversions) {
  const map = new Map(conversions.map(c => [c.file.replace(/^public/, ''), c.out.replace(/^public/, '')]))
  // Also key without leading path variants
  const pairs = [...map.entries()]
  if (!pairs.length)
    return
  const contentFiles = walk(join(root, 'content')).filter(p => /\.(md|yml|yaml|json)$/.test(p))
  const vueFiles = [
    ...walk(join(root, 'components')),
    ...walk(join(root, 'pages')),
  ].filter(p => /\.(vue|ts|js)$/.test(p))
  for (const file of [...contentFiles, ...vueFiles]) {
    let text = readFileSync(file, 'utf8')
    let changed = false
    for (const [from, to] of pairs) {
      if (text.includes(from)) {
        text = text.split(from).join(to)
        changed = true
      }
    }
    if (changed) {
      writeFileSync(file, text)
      report.actions.push({ type: 'rewrite-ref', file: relative(root, file) })
    }
  }
  // Delete original PNGs that now have webp twins and no remaining refs in content/components/pages
  for (const [from, to] of pairs) {
    const pngAbs = join(root, 'public', from.replace(/^\//, ''))
    const webpAbs = join(root, 'public', to.replace(/^\//, ''))
    try {
      const hay = walk(join(root, 'content')).concat(walk(join(root, 'components')), walk(join(root, 'pages')))
        .filter(p => /\.(md|vue|ts|js)$/.test(p))
        .map(p => readFileSync(p, 'utf8'))
        .join('\n')
      if (!hay.includes(from) && statSync(webpAbs)) {
        unlinkSync(pngAbs)
        report.actions.push({ type: 'delete-png', file: relative(root, pngAbs) })
      }
    }
    catch { /* ignore */ }
  }
}

async function main() {
  snapshot('before')
  await resizeAvatar()

  const { images, media } = listAssets()
  const webps = images.filter(p => p.endsWith('.webp'))
  for (const f of webps.sort((a, b) => statSync(b).size - statSync(a).size)) {
    if (statSync(f).size >= 100 * 1024)
      await optimizeWebp(f)
  }

  const pngs = images.filter(p => p.endsWith('.png') && (p.includes('/blog/') || p.includes('/podcasts/')))
  const pngConversions = []
  for (const f of pngs) {
    const beforeCount = report.actions.length
    await optimizePng(f)
    const added = report.actions.slice(beforeCount).filter(a => a.type === 'png-to-webp')
    pngConversions.push(...added)
  }
  if (pngConversions.length)
    rewritePngRefsToWebp(pngConversions)

  for (const f of media.filter(p => p.endsWith('.mp4')))
    optimizeVideo(f)

  await optimizeOgCards()

  // Point DEFAULT_OG_IMAGE at the new JPEG when present
  const ogTs = join(root, 'utils/og-image.ts')
  let ogText = readFileSync(ogTs, 'utf8')
  if (ogText.includes('https://debbie.codes/x-card.png')) {
    ogText = ogText.replace('https://debbie.codes/x-card.png', 'https://debbie.codes/x-card.jpg')
    writeFileSync(ogTs, ogText)
    report.actions.push({ type: 'og-default-url', to: 'https://debbie.codes/x-card.jpg' })
  }

  snapshot('after')

  // Reasons for remaining >200KB webps
  const remaining = listAssets().images.filter(p => p.endsWith('.webp') && statSync(p).size > 200 * 1024)
  for (const f of remaining.sort((a, b) => statSync(b).size - statSync(a).size)) {
    const meta = await sharp(f).metadata()
    const screenshot = isLikelyScreenshot(f)
    report.webpOver200Reasons.push({
      file: relative(root, f),
      kb: +(statSync(f).size / 1024).toFixed(1),
      dims: `${meta.width}x${meta.height}`,
      why: screenshot
        ? 'UI/screenshot with text — kept sharper quality; further loss would soft-edge type'
        : meta.height && meta.width && (meta.height / meta.width > 1.2)
          ? 'Tall portrait photo at full content width (≤1640); detail-heavy subject'
          : 'Wide photo master at max content width (≤1640 = 2× ~820 CSS)',
    })
  }

  const top20 = listAssets().images
    .sort((a, b) => statSync(b).size - statSync(a).size)
    .slice(0, 20)
    .map(p => ({ file: relative(root, p), kb: +(statSync(p).size / 1024).toFixed(1) }))
  report.top20After = top20

  writeFileSync(join(root, 'scripts/cloudinary/optimize-report.json'), `${JSON.stringify(report, null, 2)}\n`)
  console.log(JSON.stringify({ before: report.before, after: report.after, actions: report.actions.length, top20After: top20 }, null, 2))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
