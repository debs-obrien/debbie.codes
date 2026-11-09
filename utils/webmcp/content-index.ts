import { isVisibleVideo } from '../videos'

export interface Chapter {
  time: number
  title: string
}

interface ContentBase {
  title: string
  date: string
  tags: string[]
  url: string
  description: string
  path?: string
}

export interface BlogItem extends ContentBase {
  type: 'blog'
}

export interface VideoItem extends ContentBase {
  type: 'video'
  video: string
  start?: number
  conference?: string
  host?: string
  chapters?: Chapter[]
}

export interface PodcastItem extends ContentBase {
  type: 'podcast'
  host?: string
}

export interface CourseItem extends ContentBase {
  type: 'course'
  host?: string
}

export type ContentItem = BlogItem | VideoItem | PodcastItem | CourseItem

export interface ContentIndex {
  items: ContentItem[]
}

export type ContentKind = 'blog' | 'video' | 'podcast' | 'course'

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isKind(value: unknown): value is ContentKind {
  return value === 'blog' || value === 'video' || value === 'podcast' || value === 'course'
}

function stringField(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function parseChapters(value: unknown) {
  if (!Array.isArray(value))
    return undefined
  const chapters: Chapter[] = []
  for (const entry of value) {
    if (!isRecord(entry) || typeof entry.title !== 'string' || !entry.title.trim())
      continue
    if (typeof entry.time !== 'number' || !Number.isFinite(entry.time) || entry.time < 0)
      continue
    chapters.push({ time: Math.trunc(entry.time), title: entry.title.trim() })
  }
  return chapters.length ? chapters : undefined
}

function parseItem(value: unknown): ContentItem | null {
  if (!isRecord(value) || !isKind(value.type))
    return null
  const title = stringField(value.title)
  const date = stringField(value.date)
  const url = stringField(value.url)
  if (!title || !date || !url)
    return null
  const tags = Array.isArray(value.tags)
    ? value.tags.filter((tag): tag is string => typeof tag === 'string' && tag.length > 0)
    : []
  const base = {
    title,
    date,
    tags,
    url,
    description: stringField(value.description),
    ...(typeof value.path === 'string' && value.path ? { path: value.path } : {}),
  }
  if (value.type === 'video') {
    if (typeof value.video !== 'string' || !value.video.trim())
      return null
    const chapters = parseChapters(value.chapters)
    const item: VideoItem = {
      type: 'video',
      ...base,
      video: value.video.trim(),
      ...(typeof value.start === 'number' && value.start > 0 ? { start: Math.trunc(value.start) } : {}),
      ...(typeof value.conference === 'string' && value.conference ? { conference: value.conference } : {}),
      ...(typeof value.host === 'string' && value.host ? { host: value.host } : {}),
      ...(chapters ? { chapters } : {}),
    }
    return isVisibleVideo(item) ? item : null
  }
  if (value.type === 'podcast') {
    const item: PodcastItem = {
      type: 'podcast',
      ...base,
      ...(typeof value.host === 'string' && value.host ? { host: value.host } : {}),
    }
    return item
  }
  if (value.type === 'blog')
    return { type: 'blog', ...base }
  return { type: 'course', ...base }
}

export function parseContentIndex(raw: unknown): ContentIndex {
  if (!isRecord(raw) || !Array.isArray(raw.items))
    throw new Error('content index is missing items')
  const items: ContentItem[] = []
  for (const entry of raw.items) {
    const item = parseItem(entry)
    if (item)
      items.push(item)
  }
  if (!items.length && raw.items.length)
    throw new Error('content index items did not match the catalog shape')
  return { items }
}

let pending: Promise<ContentIndex> | undefined

export function loadContentIndex() {
  if (!pending) {
    pending = fetch('/webmcp/content-index.json')
      .then(async (response) => {
        if (!response.ok)
          throw new Error(`content index returned ${response.status}`)
        return parseContentIndex(await response.json())
      })
      .catch((error: unknown) => {
        pending = undefined
        throw error
      })
  }
  return pending
}

export function indexTags(index: ContentIndex) {
  const tags = new Set<string>()
  for (const item of index.items) {
    for (const tag of item.tags)
      tags.add(tag)
  }
  return [...tags].sort()
}
