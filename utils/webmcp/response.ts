import { youtubeWatchUrl } from '../youtube'
import { MAX_OUTPUT_CHARS } from './tools'

export interface VideoRow {
  title?: string
  date?: string
  video: string
  start?: number
  tags?: string[]
  conference?: string
  host?: string
  chaptersAvailable?: boolean
}

// Per-field bounds so a single video always fits inside MAX_OUTPUT_CHARS.
const MAX_TITLE = 200
const MAX_NAME = 80
const MAX_TAGS = 10
const MAX_TAG = 40

const TRIM_NOTE = 'Page trimmed to fit the size limit; use nextOffset to continue.'

function cut(value: unknown, max: number) {
  if (typeof value !== 'string')
    return null
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function toToolVideo(r: VideoRow) {
  return {
    id: r.video,
    title: cut(r.title, MAX_TITLE) ?? '',
    date: cut(r.date, 30) ?? '',
    link: youtubeWatchUrl(r.video, r.start),
    tags: (r.tags ?? []).slice(0, MAX_TAGS).map(t => cut(t, MAX_TAG) ?? ''),
    conference: cut(r.conference, MAX_NAME),
    host: cut(r.host, MAX_NAME),
    chaptersAvailable: Boolean(r.chaptersAvailable),
  }
}

function pageMeta(total: number, offset: number, returned: number, trimmed: boolean) {
  const end = offset + returned
  const hasMore = end < total
  return {
    total,
    returned,
    hasMore,
    nextOffset: hasMore ? end : null,
    ...(trimmed ? { trimmed: true as const, note: TRIM_NOTE } : {}),
  }
}

/** Build the list-videos response; the whole serialized object stays within MAX_OUTPUT_CHARS. */
export function buildVideosResponse(rows: VideoRow[], limit: number, offset = 0) {
  const total = rows.length
  const safeOffset = Math.min(Math.max(0, Math.trunc(offset) || 0), total)
  const videos = rows.slice(safeOffset, safeOffset + limit).map(toToolVideo)
  let trimmed = false
  const wrap = () => ({
    videos,
    ...pageMeta(total, safeOffset, videos.length, trimmed),
  })
  while (videos.length > 1 && JSON.stringify(wrap()).length > MAX_OUTPUT_CHARS) {
    videos.pop()
    trimmed = true
  }
  const result = wrap()
  if (JSON.stringify(result).length > MAX_OUTPUT_CHARS)
    return { error: 'That video\'s details are too long to return. Try the /videos page on debbie.codes.' }
  return result
}
