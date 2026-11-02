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
}

// Per-field bounds so a single video always fits inside MAX_OUTPUT_CHARS.
const MAX_TITLE = 200
const MAX_NAME = 80
const MAX_TAGS = 10
const MAX_TAG = 40

function cut(value: unknown, max: number) {
  if (typeof value !== 'string')
    return null
  return value.length > max ? `${value.slice(0, max - 1)}…` : value
}

function toToolVideo(r: VideoRow) {
  return {
    title: cut(r.title, MAX_TITLE) ?? '',
    date: cut(r.date, 30) ?? '',
    link: youtubeWatchUrl(r.video, r.start),
    tags: (r.tags ?? []).slice(0, MAX_TAGS).map(t => cut(t, MAX_TAG) ?? ''),
    conference: cut(r.conference, MAX_NAME),
    host: cut(r.host, MAX_NAME),
  }
}

/** Build the list-videos response; the whole serialized object stays within MAX_OUTPUT_CHARS. */
export function buildVideosResponse(rows: VideoRow[], limit: number) {
  const total = rows.length
  const videos = rows.slice(0, limit).map(toToolVideo)
  const size = () => JSON.stringify({ videos, total }).length
  while (videos.length > 1 && size() > MAX_OUTPUT_CHARS)
    videos.pop()
  if (size() > MAX_OUTPUT_CHARS)
    return { error: 'That video\'s details are too long to return. Try the /videos page on debbie.codes.' }
  return { videos, total }
}
