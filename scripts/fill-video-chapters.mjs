/**
 * Fill optional chapters on MCP-tagged videos from YouTube description timestamps.
 *
 * Rerun after adding an MCP-tagged video:
 *   node --disable-warning=MODULE_TYPELESS_PACKAGE_JSON scripts/fill-video-chapters.mjs
 *
 * Then regenerate the WebMCP index:
 *   node scripts/generate-content-index.mjs
 *
 * The script reads timestamps from the YouTube description. It skips a video
 * when that description has no timestamp list, and it never invents chapters.
 * A failed fetch leaves that file unchanged.
 */
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'
import { parseDescriptionChapters } from '../utils/description-chapters.ts'
import { normalizeTag, parseFrontmatter } from './generate-content-index.mjs'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const videosDir = join(root, 'content/videos')

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function extractJsonAfter(html, marker) {
  const at = html.search(new RegExp(`${marker}\\s*=\\s*`))
  if (at < 0)
    return null
  const start = html.indexOf('{', at)
  if (start < 0)
    return null
  let depth = 0
  let inString = false
  let escaped = false
  for (let i = start; i < html.length; i++) {
    const ch = html[i]
    if (inString) {
      if (escaped)
        escaped = false
      else if (ch === '\\')
        escaped = true
      else if (ch === '"')
        inString = false
      continue
    }
    if (ch === '"') {
      inString = true
    }
    else if (ch === '{') {
      depth++
    }
    else if (ch === '}') {
      depth--
      if (depth === 0)
        return JSON.parse(html.slice(start, i + 1))
    }
  }
  return null
}

function descriptionTexts(node, found) {
  if (!node || typeof node !== 'object')
    return
  if (!Array.isArray(node) && typeof node.attributedDescriptionBodyText?.content === 'string')
    found.push(node.attributedDescriptionBodyText.content)
  for (const value of Object.values(node))
    descriptionTexts(value, found)
}

export async function fetchYouTubeDescription(videoId) {
  const response = await fetch(`https://www.youtube.com/watch?v=${encodeURIComponent(videoId)}&hl=en`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cookie': 'CONSENT=YES+cb.20210328-17-p0.en+FX+667; SOCS=CAI',
    },
  })
  if (!response.ok)
    throw new Error(`YouTube returned ${response.status}`)
  const html = await response.text()
  const data = extractJsonAfter(html, 'ytInitialData')
  if (!data)
    throw new Error('YouTube page has no ytInitialData')
  const found = []
  descriptionTexts(data, found)
  return found.sort((a, b) => b.length - a.length)[0] ?? ''
}

function yamlString(value) {
  return `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`
}

function stripChapters(frontmatter) {
  const lines = frontmatter.split('\n')
  const out = []
  let skipping = false
  for (const line of lines) {
    if (!skipping && /^chapters:\s*(?:\[.*\]\s*)?$/.test(line)) {
      skipping = !line.includes('[')
      continue
    }
    if (skipping) {
      if (line.startsWith(' ') || line.startsWith('\t') || line.startsWith('-'))
        continue
      skipping = false
    }
    out.push(line)
  }
  return out.join('\n').replace(/\n+$/, '')
}

function sameChapters(left, right) {
  return JSON.stringify(left ?? []) === JSON.stringify(right)
}

export function withChapters(raw, chapters) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    throw new Error('missing frontmatter')
  const newline = raw.includes('\r\n') ? '\r\n' : '\n'
  const frontmatter = stripChapters(match[1].replace(/\r\n/g, '\n'))
  const block = [
    'chapters:',
    ...chapters.map(chapter => `  - time: ${chapter.time}\n    title: ${yamlString(chapter.title)}`),
  ].join('\n')
  const head = `---\n${frontmatter}\n${block}\n---`
  const body = raw.slice(match[0].length)
  return (newline === '\n' ? head : head.replace(/\n/g, newline)) + body
}

function mcpVideos() {
  return readdirSync(videosDir)
    .filter(name => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const file = join(videosDir, name)
      const raw = readFileSync(file, 'utf8')
      const fm = parseFrontmatter(raw)
      const tags = Array.isArray(fm.tags) ? fm.tags.map(normalizeTag) : []
      return { file, name, raw, fm, tags }
    })
    .filter(video => video.tags.includes('mcp') && typeof video.fm.video === 'string')
}

export async function fillVideoChapters() {
  const videos = mcpVideos()
  const summary = { mcp: videos.length, filled: 0, unchanged: 0, skipped: 0, failed: 0 }
  for (const video of videos) {
    try {
      const description = await fetchYouTubeDescription(video.fm.video)
      const chapters = parseDescriptionChapters(description)
      if (chapters.length === 0) {
        summary.skipped++
        console.log(`skip ${video.name}: description has no timestamp list`)
      }
      else if (sameChapters(video.fm.chapters, chapters)) {
        summary.unchanged++
        console.log(`keep ${video.name}: ${chapters.length} chapters`)
      }
      else {
        writeFileSync(video.file, withChapters(video.raw, chapters))
        summary.filled++
        console.log(`fill ${video.name}: ${chapters.length} chapters`)
      }
    }
    catch (error) {
      summary.failed++
      console.log(`fail ${video.name}: ${error instanceof Error ? error.message : error}`)
    }
    await sleep(200)
  }
  return summary
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectRun) {
  fillVideoChapters().then((summary) => {
    console.log(JSON.stringify(summary))
    if (summary.failed)
      process.exitCode = 1
  }).catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exitCode = 1
  })
}
