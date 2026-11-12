/**
 * Build-time WebMCP catalog, llms.txt, and llms-full.txt.
 *
 * Rerun:
 *   node scripts/generate-content-index.mjs
 *
 * nuxt.config.ts and `npm run pregenerate` call this too.
 * content-index.json and llms*.txt are committed so dev and agents can read
 * them without a content query. Blog markdown copies are served by
 * server/routes/blog/[slug].md.get.ts and prerendered at generate time.
 */
import { Buffer } from 'node:buffer'
import { mkdirSync, readdirSync, readFileSync, renameSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const SITE = 'https://debbie.codes'

const SECTIONS = [
  {
    type: 'video',
    dir: 'content/videos',
    heading: 'Videos',
    noun: 'videos',
    listingPath: '/videos',
    listingLabel: 'All videos',
    listingNote: 'Conference talks, interviews, and tutorials',
  },
  {
    type: 'blog',
    dir: 'content/blog',
    heading: 'Blog',
    noun: 'posts',
    listingPath: '/blog',
    listingLabel: 'Blog',
    listingNote: 'Articles by Debbie',
  },
  {
    type: 'podcast',
    dir: 'content/podcasts',
    heading: 'Podcasts',
    noun: 'episodes',
    listingPath: '/podcasts',
    listingLabel: 'Podcasts',
    listingNote: 'Interviews and shows',
  },
  {
    type: 'course',
    dir: 'content/courses',
    heading: 'Courses',
    noun: 'courses',
    listingPath: '/courses',
    listingLabel: 'Courses',
    listingNote: 'Courses Debbie teaches',
  },
]

export function normalizeTag(tag) {
  return String(tag).trim().toLowerCase().replace(/\s+/g, '-')
}

function hiddenYouTubeIds() {
  const src = readFileSync(join(root, 'utils/videos.ts'), 'utf8')
  const block = src.match(/HIDDEN_YOUTUBE_VIDEO_IDS = new Set\(\[([\s\S]*?)\]\)/)
  if (!block)
    throw new Error('utils/videos.ts is missing HIDDEN_YOUTUBE_VIDEO_IDS')
  const ids = [...block[1].matchAll(/'([^']+)'/g)].map(match => match[1])
  if (ids.length === 0)
    throw new Error('HIDDEN_YOUTUBE_VIDEO_IDS is empty')
  return new Set(ids)
}

/** Registered WebMCP tool names from utils/webmcp/tools.ts (not hardcoded). */
export function webmcpToolNames() {
  const src = readFileSync(join(root, 'utils/webmcp/tools.ts'), 'utf8')
  const names = [...src.matchAll(/^\s+name:\s*'([a-z0-9-]+)',\s*$/gm)].map(match => match[1])
  if (names.length === 0)
    throw new Error('utils/webmcp/tools.ts has no tool name fields')
  return names
}

function youtubeWatchUrl(videoId, start) {
  const url = `https://www.youtube.com/watch?v=${encodeURIComponent(String(videoId).trim())}`
  const seconds = Math.trunc(Number(start) || 0)
  return seconds > 0 ? `${url}&t=${seconds}s` : url
}

function parseScalar(raw) {
  const value = String(raw).trim()
  if (value.startsWith('"'))
    return readQuoted(value, '"')
  if (value.startsWith('\''))
    return readQuoted(value, '\'')
  if (value.startsWith('[') && value.endsWith(']'))
    return splitList(value.slice(1, -1))
  if (value === 'true')
    return true
  if (value === 'false')
    return false
  if (value === 'null' || value === '~')
    return null
  if (/^-?\d+(?:\.\d+)?$/.test(value))
    return Number(value)
  return value
}

function readQuoted(value, quote) {
  let out = ''
  for (let i = 1; i < value.length; i++) {
    const ch = value[i]
    if (quote === '\'' && ch === '\'' && value[i + 1] === '\'') {
      out += '\''
      i++
      continue
    }
    if (ch === '\\' && quote === '"') {
      const next = value[++i]
      if (next === 'n') {
        out += '\n'
      }
      else if (next === 't') {
        out += '\t'
      }
      else if (next === 'u' || next === 'U') {
        const size = next === 'u' ? 4 : 8
        const hex = value.slice(i + 1, i + 1 + size)
        if (hex.length === size && /^[0-9a-f]+$/i.test(hex)) {
          out += String.fromCodePoint(Number.parseInt(hex, 16))
          i += size
          continue
        }
        out += next ?? ''
      }
      else {
        out += next ?? ''
      }
      continue
    }
    if (ch === quote)
      return out
    out += ch
  }
  return out
}

function splitList(inner) {
  const items = []
  let buf = ''
  let quote = ''
  for (let i = 0; i < inner.length; i++) {
    const ch = inner[i]
    if (quote) {
      buf += ch
      if (ch === quote && inner[i - 1] !== '\\')
        quote = ''
      continue
    }
    if (ch === '"' || ch === '\'') {
      quote = ch
      buf += ch
      continue
    }
    if (ch === ',') {
      const item = parseScalar(buf)
      if (item !== '')
        items.push(item)
      buf = ''
      continue
    }
    buf += ch
  }
  if (buf.trim()) {
    const item = parseScalar(buf)
    if (item !== '')
      items.push(item)
  }
  return items
}

function parseChapters(lines) {
  const chapters = []
  let current = null
  for (const line of lines) {
    const time = line.trim().match(/^- time: (\S+)$/)
    if (time) {
      const seconds = Number(parseScalar(time[1]))
      current = Number.isFinite(seconds) ? { time: Math.trunc(seconds), title: '' } : null
      if (current)
        chapters.push(current)
      continue
    }
    const title = line.trim().match(/^title: (.*)$/)
    if (title && current)
      current.title = String(parseScalar(title[1])).trim()
  }
  return chapters.filter(chapter => chapter.title)
}

export function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!match)
    return {}
  const lines = match[1].split(/\r?\n/)
  const out = {}
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim() || line.trimStart().startsWith('#')) {
      i++
      continue
    }
    const key = line.match(/^(\w+):(.*)$/)
    if (!key) {
      i++
      continue
    }
    const rest = key[2].trim()
    if (rest === '' || rest === '|' || rest === '>') {
      const block = []
      i++
      while (i < lines.length && (lines[i].startsWith(' ') || lines[i].startsWith('\t'))) {
        block.push(lines[i])
        i++
      }
      out[key[1]] = key[1] === 'chapters' ? parseChapters(block) : block.map(entry => entry.trim()).join('\n')
      continue
    }
    out[key[1]] = parseScalar(rest)
    i++
  }
  return out
}

function listMarkdown(dir) {
  return readdirSync(join(root, dir))
    .filter(name => name.endsWith('.md'))
    .sort()
    .map(name => ({
      slug: name.replace(/\.md$/, ''),
      file: join(dir, name),
      raw: readFileSync(join(root, dir, name), 'utf8'),
    }))
}

function asString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

function asTags(value) {
  const list = Array.isArray(value) ? value : []
  const tags = []
  for (const tag of list) {
    const normalized = normalizeTag(tag)
    if (normalized && !tags.includes(normalized))
      tags.push(normalized)
  }
  return tags
}

function asChapters(value) {
  if (!Array.isArray(value))
    return []
  const chapters = []
  for (const chapter of value) {
    if (!chapter || typeof chapter !== 'object')
      continue
    const time = Math.trunc(Number(chapter.time))
    const title = asString(chapter.title)
    if (!Number.isFinite(time) || time < 0 || !title)
      continue
    chapters.push({ time, title })
  }
  return chapters.sort((a, b) => a.time - b.time || a.title.localeCompare(b.title))
}

function withDescription(item, description) {
  if (description)
    item.description = description
  return item
}

function indexBlog(entry) {
  const fm = parseFrontmatter(entry.raw)
  if (fm.published === false)
    return null
  const title = asString(fm.title)
  const date = asString(fm.date)
  if (!title || !date)
    throw new Error(`${entry.file} is missing title or date`)
  const path = `/blog/${entry.slug}`
  const markdownPath = `${path}.md`
  return withDescription({
    type: 'blog',
    title,
    date,
    tags: asTags(fm.tags),
    url: `${SITE}${path}`,
    path,
    markdownUrl: `${SITE}${markdownPath}`,
  }, asString(fm.description))
}

function indexVideo(entry, hidden) {
  const fm = parseFrontmatter(entry.raw)
  const video = asString(fm.video)
  if (!video)
    throw new Error(`${entry.file} is missing video`)
  if (hidden.has(video))
    return null
  const title = asString(fm.title)
  const date = asString(fm.date)
  if (!title || !date)
    throw new Error(`${entry.file} is missing title or date`)
  const start = Math.trunc(Number(fm.start) || 0)
  const item = withDescription({
    type: 'video',
    title,
    date,
    tags: asTags(fm.tags),
    url: youtubeWatchUrl(video, start),
    video,
  }, asString(fm.description))
  if (start > 0)
    item.start = start
  const conference = asString(fm.conference)
  const host = asString(fm.host)
  if (conference)
    item.conference = conference
  if (host)
    item.host = host
  const chapters = asChapters(fm.chapters)
  if (chapters.length)
    item.chapters = chapters
  return item
}

function indexExternal(entry, type) {
  const fm = parseFrontmatter(entry.raw)
  const title = asString(fm.title)
  const date = asString(fm.date)
  const url = asString(fm.url)
  if (!title || !date || !url)
    throw new Error(`${entry.file} is missing title, date, or url`)
  const item = withDescription({
    type,
    title,
    date,
    tags: asTags(fm.tags),
    url,
  }, asString(fm.description))
  const host = asString(fm.host)
  if (host)
    item.host = host
  return item
}

function compareItems(a, b) {
  const order = { blog: 0, video: 1, podcast: 2, course: 3 }
  return order[a.type] - order[b.type]
    || b.date.localeCompare(a.date)
    || a.title.localeCompare(b.title)
    || a.url.localeCompare(b.url)
}

function mdLink(title, url, note) {
  const safe = title.replace(/[[\]]/g, '').replace(/\s+/g, ' ').trim()
  return `- [${safe}](${url}): ${note}`
}

const FEATURED_TAGS = ['playwright', 'mcp', 'ai', 'nuxt', 'testing', 'grok-bot']

function topTags(items, type) {
  const counts = new Map()
  for (const item of items) {
    if (item.type !== type)
      continue
    for (const tag of item.tags)
      counts.set(tag, (counts.get(tag) ?? 0) + 1)
  }
  const featured = FEATURED_TAGS.filter(tag => (counts.get(tag) ?? 0) >= 1)
  const rest = [...counts.entries()]
    .filter(([tag, count]) => count >= 2 && !featured.includes(tag))
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .map(([tag]) => tag)
  return [...featured, ...rest].slice(0, 6)
}

function itemNote(item, kind) {
  const bits = [kind, item.date]
  if (item.description)
    bits.push(item.description.replace(/\s+/g, ' ').trim())
  if (item.tags.length)
    bits.push(`tags: ${item.tags.join(', ')}`)
  return bits.join(' · ')
}

function renderLlms(items) {
  const tools = webmcpToolNames().join(', ')
  const lines = [
    '# Debbie Codes',
    '',
    '> Debbie O\'Brien is an Independent Developer Educator known for AI agents, Playwright, testing, and DevRel. Former Microsoft TPM on Playwright and a Google Developer Expert in web technologies, she teaches developers to ship and test with multi-agent workflows.',
    '',
    `This site publishes her videos, blog posts, podcasts, and courses. Prefer the markdown copies of blog posts (\`/blog/<slug>.md\`) and [\`/llms-full.txt\`](${SITE}/llms-full.txt) for bulk reading. On pages where \`document.modelContext\` is available, agents can call the WebMCP tools ${tools}.`,
    '',
    '## Pages',
    '',
    mdLink('About', `${SITE}/about`, 'Biography and background'),
    mdLink('Hire me', `${SITE}/hire-me`, 'Experience, Voice agent Q&A, and how to work with Debbie'),
    mdLink('Courses', `${SITE}/courses`, 'Courses Debbie teaches'),
    mdLink('Videos', `${SITE}/videos`, 'Conference talks, interviews, and tutorials'),
    mdLink('Blog', `${SITE}/blog`, 'Articles by Debbie'),
    mdLink('Podcasts', `${SITE}/podcasts`, 'Interviews and shows'),
    '',
  ]
  for (const section of SECTIONS) {
    lines.push(`## ${section.heading}`, '')
    lines.push(mdLink(section.listingLabel, `${SITE}${section.listingPath}`, section.listingNote))
    for (const tag of topTags(items, section.type)) {
      lines.push(mdLink(
        `${tag} ${section.noun}`,
        `${SITE}${section.listingPath}/tags/${tag}`,
        `${section.heading} tagged ${tag}`,
      ))
    }
    const newest = items
      .filter(item => item.type === section.type)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
      .slice(0, 3)
    for (const item of newest) {
      const kind = section.heading.endsWith('s') ? section.heading.slice(0, -1) : section.heading
      const href = item.markdownUrl || item.url
      lines.push(mdLink(item.title, href, `${kind}, ${item.date}`))
    }
    lines.push('')
  }
  lines.push(
    '## Optional',
    '',
    mdLink('Full content index (llms-full.txt)', `${SITE}/llms-full.txt`, 'Every published video, blog post, podcast, and course'),
    mdLink('Speaking', `${SITE}/speaking`, 'Conference talks and where to watch them'),
    mdLink('Now', `${SITE}/now`, 'What Debbie is doing now'),
    mdLink('Contact', `${SITE}/contact`, 'Contact Debbie'),
    mdLink('RSS feed', `${SITE}/feed.xml`, 'Blog RSS'),
    '',
  )
  return lines.join('\n')
}

function renderLlmsFull(items) {
  const tools = webmcpToolNames().join(', ')
  const lines = [
    '# Debbie Codes — Full content index',
    '',
    '> Complete catalog of published videos, blog posts, podcasts, and courses on debbie.codes, newest first. Blog entries link to both the HTML page and a clean markdown copy.',
    '',
    `WebMCP tools (when document.modelContext is available): ${tools}.`,
    '',
  ]
  for (const section of SECTIONS) {
    lines.push(`## ${section.heading}`, '')
    const sectionItems = items
      .filter(item => item.type === section.type)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title))
    for (const item of sectionItems) {
      const kind = section.heading.endsWith('s') ? section.heading.slice(0, -1) : section.heading
      lines.push(mdLink(item.title, item.url, itemNote(item, kind)))
      if (item.markdownUrl)
        lines.push(mdLink(`${item.title} (markdown)`, item.markdownUrl, `Markdown copy, ${item.date}`))
    }
    lines.push('')
  }
  return lines.join('\n')
}

function writeAtomic(file, text) {
  mkdirSync(dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  writeFileSync(tmp, text)
  renameSync(tmp, file)
}

export function generateContentIndex() {
  const hidden = hiddenYouTubeIds()
  const items = []
  for (const entry of listMarkdown('content/blog')) {
    const item = indexBlog(entry)
    if (item)
      items.push(item)
  }
  for (const entry of listMarkdown('content/videos')) {
    const item = indexVideo(entry, hidden)
    if (item)
      items.push(item)
  }
  for (const entry of listMarkdown('content/podcasts'))
    items.push(indexExternal(entry, 'podcast'))
  for (const entry of listMarkdown('content/courses'))
    items.push(indexExternal(entry, 'course'))

  items.sort(compareItems)
  const banned = items.filter(item => item.video && hidden.has(item.video))
  if (banned.length)
    throw new Error(`index included banned videos: ${banned.map(item => item.video).join(', ')}`)

  const indexPath = join(root, 'public/webmcp/content-index.json')
  const llmsPath = join(root, 'public/llms.txt')
  const llmsFullPath = join(root, 'public/llms-full.txt')
  const indexText = `${JSON.stringify({ items }, null, 2)}\n`
  const llmsText = renderLlms(items)
  const llmsFullText = renderLlmsFull(items)
  writeAtomic(indexPath, indexText)
  writeAtomic(llmsPath, llmsText)
  writeAtomic(llmsFullPath, llmsFullText)
  const markdownRoutes = items
    .filter(item => item.type === 'blog' && item.path)
    .map(item => `${item.path}.md`)
  // Per-file Content-Type so missing /blog/*.md 404s are not forced to text/markdown
  // by a Netlify glob header.
  const headersPath = join(root, 'public/_headers')
  const headersText = [
    '# Generated by scripts/generate-content-index.mjs — do not edit by hand.',
    '# Published blog markdown copies only (avoids text/markdown on 404 bodies).',
    ...markdownRoutes.flatMap(route => [
      route,
      '  Content-Type: text/markdown; charset=utf-8',
      '',
    ]),
  ].join('\n')
  writeAtomic(headersPath, `${headersText.trimEnd()}\n`)
  return {
    indexPath,
    llmsPath,
    llmsFullPath,
    headersPath,
    markdownRoutes,
    items,
    bytes: Buffer.byteLength(indexText),
    count: items.length,
    counts: {
      blog: items.filter(item => item.type === 'blog').length,
      video: items.filter(item => item.type === 'video').length,
      podcast: items.filter(item => item.type === 'podcast').length,
      course: items.filter(item => item.type === 'course').length,
    },
  }
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]
if (isDirectRun) {
  const result = generateContentIndex()
  console.log(`Wrote ${result.count} items (${result.bytes} bytes) to ${result.indexPath}`)
  console.log(`counts ${JSON.stringify(result.counts)}`)
  console.log(`Wrote ${result.llmsPath}`)
  console.log(`Wrote ${result.llmsFullPath}`)
  console.log(`Blog markdown routes to prerender: ${result.markdownRoutes.length}`)
}
