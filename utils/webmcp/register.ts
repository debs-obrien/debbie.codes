import type { ContentKind } from './content-index'
import { loadContentIndex } from './content-index'
import { currentPage, listVideos, searchContent, topicBrief } from './query'
import { webmcpTools } from './tools'

let controller: AbortController | undefined

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function text(value: unknown, max: number) {
  if (typeof value !== 'string')
    return undefined
  const trimmed = value.trim().slice(0, max)
  return trimmed || undefined
}

function failure(error: unknown) {
  const message = error instanceof Error ? error.message : 'unknown error'
  return { error: `debbie.codes could not answer right now (${message}). Try again.` }
}

function readLimit(value: unknown) {
  return Math.min(Math.max(Math.trunc(Number(value ?? 5)) || 5, 1), 10)
}

function readKind(value: unknown): ContentKind | 'invalid' | undefined {
  if (typeof value !== 'string')
    return undefined
  const kind = value.trim().toLowerCase()
  if (!kind)
    return undefined
  if (kind === 'blog' || kind === 'video' || kind === 'podcast' || kind === 'course')
    return kind
  return 'invalid'
}

function currentPathname() {
  if (typeof window === 'undefined')
    return '/'
  try {
    return decodeURIComponent(window.location.pathname || '/')
  }
  catch {
    return window.location.pathname || '/'
  }
}

async function executeListVideos(raw: unknown) {
  try {
    const record = isRecord(raw) ? raw : {}
    const index = await loadContentIndex()
    return listVideos(index, {
      tag: text(record.tag, 40)?.toLowerCase().replace(/\s+/g, '-'),
      conference: text(record.conference, 80),
      host: text(record.host, 80),
      limit: readLimit(record.limit),
    })
  }
  catch (error) {
    return failure(error)
  }
}

async function executeTopicBrief(raw: unknown) {
  try {
    const record = isRecord(raw) ? raw : {}
    const index = await loadContentIndex()
    return topicBrief(index, text(record.topic, 80) ?? '')
  }
  catch (error) {
    return failure(error)
  }
}

async function executeSearchContent(raw: unknown) {
  try {
    const record = isRecord(raw) ? raw : {}
    const kind = readKind(record.type)
    if (kind === 'invalid') {
      const shown = text(record.type, 40) ?? ''
      return { error: `Type '${shown}' is not a content type. Use blog, video, podcast, or course.` }
    }
    const index = await loadContentIndex()
    return searchContent(index, {
      query: text(record.query, 200) ?? '',
      ...(kind ? { type: kind } : {}),
    })
  }
  catch (error) {
    return failure(error)
  }
}

async function executeGetCurrentPage() {
  try {
    const index = await loadContentIndex()
    return currentPage(index, currentPathname())
  }
  catch (error) {
    return failure(error)
  }
}

export async function registerWebMCPTools(mc: { registerTool: (tool: object, options?: object) => Promise<unknown> }) {
  controller?.abort()
  controller = new AbortController()
  const { signal } = controller
  const tools = [
    [webmcpTools.listVideos, executeListVideos],
    [webmcpTools.topicBrief, executeTopicBrief],
    [webmcpTools.searchContent, executeSearchContent],
    [webmcpTools.getCurrentPage, executeGetCurrentPage],
  ] as const
  for (const [tool, execute] of tools)
    await mc.registerTool({ ...tool, execute }, { signal }).catch(() => {})
  void loadContentIndex().catch(() => {})
}
