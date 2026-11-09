import type { ContentIndex, ContentItem, ContentKind, VideoItem } from './content-index'
import type { VideoRow } from './response'
import { youtubeWatchUrl } from '../youtube'
import { indexTags } from './content-index'
import { buildVideosResponse } from './response'
import { MAX_OUTPUT_CHARS } from './tools'

const SITE = 'https://debbie.codes'
const MAX_HIGHLIGHTS = 8
const MAX_RESULTS = 6
const MAX_RELATED = 4

const SECTION_PATH: Record<ContentKind, string> = {
  video: 'videos',
  blog: 'blog',
  podcast: 'podcasts',
  course: 'courses',
}

const SECTION_PREFERENCE: ContentKind[] = ['video', 'blog', 'podcast', 'course']

const TOOL_HINT = 'Use list-videos to browse talks, topic-brief for one topic, or search-content to find a specific piece.'

const PAGE_NAMES: Record<string, string> = {
  '/': 'Home',
  '/about': 'About',
  '/speaking': 'Speaking',
  '/videos': 'Videos',
  '/videos/all': 'Videos',
  '/podcasts': 'Podcasts',
  '/courses': 'Courses',
  '/blog': 'Blog',
  '/now': 'Now',
  '/contact': 'Contact',
}

/**
 * Phrases whose slug is not the tag itself. Targets have to exist in the index.
 * "agents" is its own tag, so it is not redirected at the video-chip "ai" tag.
 */
const TOPIC_ALIASES: Record<string, string> = {
  'model context protocol': 'mcp',
  'artificial intelligence': 'ai',
  'github copilot': 'githubcopilot',
  'jam stack': 'jamstack',
  'grokbot': 'grok-bot',
}

export interface ListVideosInput {
  tag?: string
  conference?: string
  host?: string
  limit: number
}

function clip(value: string, max: number) {
  const text = value.trim()
  if (text.length <= max)
    return text
  return `${text.slice(0, Math.max(0, max - 1))}…`
}

function jsonSize(value: unknown) {
  return JSON.stringify(value).length
}

function byDateDesc(a: ContentItem, b: ContentItem) {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title)
}

function byDateAsc(a: ContentItem, b: ContentItem) {
  return a.date.localeCompare(b.date) || a.title.localeCompare(b.title)
}

function countByType(items: ContentItem[]) {
  const counts: Record<ContentKind, number> = { blog: 0, video: 0, podcast: 0, course: 0 }
  for (const item of items)
    counts[item.type] += 1
  return counts
}

export function normalizeTopic(raw: string) {
  return raw.trim().toLowerCase().replace(/[_-]+/g, ' ').replace(/\s+/g, ' ')
}

function containedTags(spaced: string, tags: string[]) {
  const words = new Set(spaced.split(' ').filter(Boolean))
  return tags.filter((tag) => {
    const phrase = tag.replace(/-/g, ' ')
    return words.has(tag) || words.has(phrase) || (phrase.includes(' ') && spaced.includes(phrase))
  })
}

function levenshtein(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, index) => index)
  const curr = Array.from({ length: b.length + 1 }, () => 0)
  for (let i = 1; i <= a.length; i++) {
    curr[0] = i
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost)
    }
    for (let j = 0; j < prev.length; j++)
      prev[j] = curr[j]
  }
  return prev[b.length] ?? 0
}

export function closestTags(query: string, tags: string[]) {
  const spaced = normalizeTopic(query)
  const contained = containedTags(spaced, tags)
  if (contained.length)
    return contained.slice(0, 4)
  const compact = spaced.replace(/[^a-z0-9]+/g, '')
  const ranked = tags.map((tag) => {
    const other = tag.replace(/-/g, '')
    const max = Math.max(compact.length, other.length) || 1
    const ratio = 1 - levenshtein(compact, other) / max
    const includes = compact.length >= 3 && (other.includes(compact) || compact.includes(other))
    return { tag, ratio: includes ? Math.max(ratio, 0.75) : ratio }
  }).filter(row => row.ratio >= 0.45).sort((a, b) => b.ratio - a.ratio || a.tag.localeCompare(b.tag))
  if (ranked.length)
    return ranked.slice(0, 4).map(row => row.tag)
  return ['playwright', 'mcp', 'ai', 'nuxt', 'testing'].filter(tag => tags.includes(tag)).slice(0, 4)
}

function topicError(raw: string, tags: string[]) {
  const shown = clip(raw, 80)
  const hints = closestTags(raw, tags)
  if (!hints.length)
    return { error: `No content matched topic '${shown}'.` }
  return { error: `No content matched topic '${shown}'. Closest tags: ${hints.join(', ')}.` }
}

export function resolveTopic(raw: string, tags: string[]) {
  const spaced = normalizeTopic(raw)
  if (!spaced)
    return { error: 'Provide a topic such as playwright, mcp, ai or nuxt.' }
  const alias = TOPIC_ALIASES[spaced]
  if (alias && tags.includes(alias))
    return { tag: alias }
  const slug = spaced.replace(/ /g, '-')
  if (tags.includes(slug))
    return { tag: slug }
  const contained = containedTags(spaced, tags)
  if (contained.length === 1 && contained[0])
    return { tag: contained[0] }
  return topicError(raw, tags)
}

function noVideoMatch(input: ListVideosInput) {
  const parts: string[] = []
  if (input.tag)
    parts.push(`tag '${input.tag}'`)
  if (input.conference)
    parts.push(`conference '${input.conference}'`)
  if (input.host)
    parts.push(`host '${input.host}'`)
  const matched = parts.length ? ` ${parts.join(', ')}` : ''
  return { error: `No videos matched${matched}. Try a tag like playwright, mcp, ai or nuxt.` }
}

function toVideoRow(item: VideoItem): VideoRow {
  return {
    title: item.title,
    date: item.date,
    video: item.video,
    ...(item.start ? { start: item.start } : {}),
    tags: item.tags,
    conference: item.conference,
    host: item.host,
  }
}

export function listVideos(index: ContentIndex, input: ListVideosInput) {
  const needleConference = input.conference?.toLowerCase()
  const needleHost = input.host?.toLowerCase()
  const rows = index.items.filter((item): item is VideoItem => {
    if (item.type !== 'video')
      return false
    if (input.tag && !item.tags.includes(input.tag))
      return false
    if (needleConference && !item.conference?.toLowerCase().includes(needleConference))
      return false
    if (needleHost && !item.host?.toLowerCase().includes(needleHost))
      return false
    return true
  }).sort(byDateDesc)
  if (!rows.length)
    return noVideoMatch(input)
  return buildVideosResponse(rows.map(toVideoRow), input.limit)
}

function listingUrl(tag: string, items: ContentItem[]) {
  const counts = countByType(items)
  let best: ContentKind = 'video'
  let bestCount = -1
  for (const kind of SECTION_PREFERENCE) {
    if (counts[kind] > bestCount) {
      best = kind
      bestCount = counts[kind]
    }
  }
  return `${SITE}/${SECTION_PATH[best]}/tags/${tag}`
}

function toHighlight(item: ContentItem, chapterBudget: number) {
  const highlight: {
    type: ContentKind
    title: string
    date: string
    url: string
    chapters?: { title: string, url: string }[]
  } = {
    type: item.type,
    title: clip(item.title, 140),
    date: item.date,
    url: item.url,
  }
  if (item.type === 'video' && chapterBudget > 0 && item.chapters?.length) {
    highlight.chapters = item.chapters.slice(0, chapterBudget).map(chapter => ({
      title: clip(chapter.title, 80),
      url: youtubeWatchUrl(item.video, chapter.time),
    }))
  }
  return highlight
}

export function topicBrief(index: ContentIndex, topic: string) {
  const tags = indexTags(index)
  const resolved = resolveTopic(topic, tags)
  if ('error' in resolved)
    return resolved
  const matched = index.items.filter(item => item.tags.includes(resolved.tag))
  if (!matched.length)
    return topicError(topic, tags)
  const ordered = [...matched].sort(byDateAsc)
  const newest = [...matched].sort(byDateDesc)
  const base = {
    topic: resolved.tag,
    total: matched.length,
    counts: countByType(matched),
    first: ordered[0]?.date ?? '',
    latest: ordered[ordered.length - 1]?.date ?? '',
    listing: listingUrl(resolved.tag, matched),
  }
  let chapterBudget = 2
  let count = Math.min(MAX_HIGHLIGHTS, newest.length)
  const build = () => ({
    ...base,
    highlights: newest.slice(0, count).map(item => toHighlight(item, chapterBudget)),
  })
  let result = build()
  while (jsonSize(result) > MAX_OUTPUT_CHARS && count > 1) {
    count -= 1
    result = build()
  }
  while (jsonSize(result) > MAX_OUTPUT_CHARS && chapterBudget > 0) {
    chapterBudget -= 1
    result = build()
  }
  if (jsonSize(result) > MAX_OUTPUT_CHARS) {
    result = {
      ...base,
      highlights: newest.slice(0, 1).map(item => ({
        type: item.type,
        title: clip(item.title, 80),
        date: item.date,
        url: item.url,
      })),
    }
  }
  if (jsonSize(result) > MAX_OUTPUT_CHARS)
    return { error: 'That topic brief is too long to return. Open the listing on debbie.codes.' }
  return result
}

function tokenize(query: string) {
  return query.toLowerCase().match(/[a-z0-9]+/g)?.filter(token => token.length > 1) ?? []
}

function chapterMatch(item: ContentItem, words: string[]) {
  if (item.type !== 'video' || !item.chapters?.length)
    return undefined
  let best: { time: number, title: string, score: number } | undefined
  for (const chapter of item.chapters) {
    const title = chapter.title.toLowerCase()
    const score = words.filter(word => title.includes(word)).length
    if (!score)
      continue
    if (!best || score > best.score || (score === best.score && chapter.time < best.time))
      best = { time: chapter.time, title: chapter.title, score }
  }
  return best
}

function searchScore(item: ContentItem, words: string[]) {
  const title = item.title.toLowerCase()
  const tags = item.tags.join(' ')
  const description = item.description.toLowerCase()
  const chapters = item.type === 'video'
    ? (item.chapters ?? []).map(chapter => chapter.title.toLowerCase()).join(' ')
    : ''
  const haystack = `${title} ${tags} ${description} ${chapters}`
  if (!words.every(word => haystack.includes(word)))
    return null
  let score = 0
  for (const word of words) {
    if (title.includes(word))
      score += 5
    else if (item.tags.some(tag => tag.includes(word)))
      score += 4
    else if (chapters.includes(word))
      score += 3
    else
      score += 1
  }
  return score
}

function searchError(query: string, tags: string[]) {
  const shown = clip(query, 80)
  const hints = closestTags(query, tags)
  if (!hints.length)
    return { error: `No content matched '${shown}'.` }
  return { error: `No content matched '${shown}'. Closest tags: ${hints.join(', ')}.` }
}

export function searchContent(index: ContentIndex, input: { query: string, type?: ContentKind }) {
  const words = tokenize(input.query)
  if (!words.length)
    return { error: 'Provide keywords to search Debbie\'s videos, posts, podcasts, or courses.' }
  const pool = input.type
    ? index.items.filter(item => item.type === input.type)
    : index.items
  const ranked = pool.flatMap((item) => {
    const score = searchScore(item, words)
    return score == null ? [] : [{ item, score }]
  }).sort((a, b) => b.score - a.score || byDateDesc(a.item, b.item))
  if (!ranked.length)
    return searchError(input.query, indexTags(index))
  let count = Math.min(MAX_RESULTS, ranked.length)
  const build = () => ({
    results: ranked.slice(0, count).map(({ item }) => {
      const chapter = chapterMatch(item, words)
      const result: {
        type: ContentKind
        title: string
        date: string
        url: string
        chapter?: string
      } = {
        type: item.type,
        title: clip(item.title, 140),
        date: item.date,
        url: chapter && item.type === 'video' ? youtubeWatchUrl(item.video, chapter.time) : item.url,
      }
      if (chapter)
        result.chapter = clip(chapter.title, 80)
      return result
    }),
  })
  let result = build()
  while (jsonSize(result) > MAX_OUTPUT_CHARS && count > 1) {
    count -= 1
    result = build()
  }
  if (jsonSize(result) > MAX_OUTPUT_CHARS)
    return { error: 'That search is too long to return. Try a shorter query on debbie.codes.' }
  return result
}

function pageForKind(type: ContentKind) {
  switch (type) {
    case 'blog':
      return 'Blog post'
    case 'video':
      return 'Video'
    case 'podcast':
      return 'Podcast'
    case 'course':
      return 'Course'
    default: {
      const unreachable: never = type
      return unreachable
    }
  }
}

function relatedItems(index: ContentIndex, item: ContentItem) {
  const tags = new Set(item.tags)
  return index.items
    .filter(other => !(other.type === item.type && other.url === item.url))
    .map(other => ({
      other,
      score: other.tags.filter(tag => tags.has(tag)).length,
    }))
    .filter(row => row.score > 0)
    .sort((a, b) => b.score - a.score || byDateDesc(a.other, b.other))
    .slice(0, MAX_RELATED)
    .map(row => ({
      type: row.other.type,
      title: clip(row.other.title, 100),
      date: row.other.date,
      url: row.other.url,
    }))
}

function contentChapters(item: ContentItem, limit: number) {
  if (item.type !== 'video' || !item.chapters?.length || limit <= 0)
    return undefined
  return item.chapters.slice(0, limit).map(chapter => ({
    time: chapter.time,
    title: clip(chapter.title, 80),
    url: youtubeWatchUrl(item.video, chapter.time),
  }))
}

export function currentPage(index: ContentIndex, pathname: string) {
  const path = pathname.trim() || '/'
  const normalized = path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path
  const item = index.items.find(entry => entry.path === normalized)
  if (item) {
    const related = relatedItems(index, item)
    let chapterLimit = item.type === 'video' ? Math.min(item.chapters?.length ?? 0, 12) : 0
    let relatedLimit = related.length
    const build = () => {
      const chapters = contentChapters(item, chapterLimit)
      return {
        page: pageForKind(item.type),
        type: item.type,
        title: clip(item.title, 180),
        date: item.date,
        tags: item.tags,
        url: item.url,
        ...(chapters ? { chapters } : {}),
        related: related.slice(0, relatedLimit),
      }
    }
    let result = build()
    while (jsonSize(result) > MAX_OUTPUT_CHARS && chapterLimit > 0) {
      chapterLimit -= 1
      result = build()
    }
    while (jsonSize(result) > MAX_OUTPUT_CHARS && relatedLimit > 0) {
      relatedLimit -= 1
      result = build()
    }
    if (jsonSize(result) <= MAX_OUTPUT_CHARS)
      return result
    return {
      page: pageForKind(item.type),
      type: item.type,
      title: clip(item.title, 80),
      date: item.date,
      tags: item.tags.slice(0, 6),
      url: item.url,
    }
  }

  const tagPage = normalized.match(/^\/(blog|videos|podcasts|courses)\/tags\/([^/]+)$/)
  if (tagPage) {
    const tag = decodeURIComponent(tagPage[2] ?? '').toLowerCase()
    const section = PAGE_NAMES[`/${tagPage[1]}`] ?? 'Page'
    return {
      page: section,
      tag,
      hint: `Use topic-brief with topic "${clip(tag, 40)}" for counts and highlights across Debbie's videos, posts, podcasts, and courses.`,
    }
  }
  if (/^\/blog\/(?:page|year)\/[^/]+$/.test(normalized))
    return { page: 'Blog', hint: TOOL_HINT }
  if (/^\/videos\/page\/[^/]+$/.test(normalized))
    return { page: 'Videos', hint: TOOL_HINT }
  return {
    page: PAGE_NAMES[normalized] ?? 'Page',
    ...(PAGE_NAMES[normalized] ? {} : { path: normalized }),
    hint: TOOL_HINT,
  }
}
