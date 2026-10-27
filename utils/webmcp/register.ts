import { filterVisibleVideos } from '../videos'
import { announceListVideos } from './announce'
import { buildVideosResponse } from './response'
import { webmcpTools } from './tools'

let controller: AbortController | undefined

function text(value: unknown, max: number) {
  return typeof value === 'string' ? value.trim().slice(0, max) || undefined : undefined
}

function noMatchError(input: { tag?: string, conference?: string, host?: string }) {
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

export async function registerWebMCPTools(mc: { registerTool: (tool: object, options?: object) => Promise<unknown> }) {
  controller?.abort()
  controller = new AbortController()
  const { signal } = controller

  const t = webmcpTools.listVideos
  await mc.registerTool({
    ...t,
    async execute(raw: Record<string, unknown> | null = {}) {
      try {
        const input = {
          tag: text(raw?.tag, 40)?.toLowerCase(),
          conference: text(raw?.conference, 80),
          host: text(raw?.host, 80),
        }
        const limit = Math.min(Math.max(Math.trunc(Number(raw?.limit ?? 5)) || 5, 1), 10)
        let q = queryCollection('videos')
          .select('title', 'date', 'conference', 'host', 'video', 'start', 'tags')
          .order('date', 'DESC')
        if (input.conference)
          q = q.where('conference', 'LIKE', `%${input.conference}%`)
        if (input.host)
          q = q.where('host', 'LIKE', `%${input.host}%`)
        let rows = await q.all()
        if (input.tag)
          rows = rows.filter(r => r.tags?.some((x: string) => x.toLowerCase() === input.tag))
        rows = filterVisibleVideos(rows)
        if (!rows.length) {
          const err = noMatchError(input)
          announceListVideos({ tag: input.tag, error: err.error })
          return err
        }

        const response = buildVideosResponse(rows, limit)
        if ('error' in response && response.error) {
          announceListVideos({ tag: input.tag, error: response.error })
          return response
        }
        const count = 'videos' in response ? response.videos.length : 0
        announceListVideos({
          tag: input.tag,
          videoIds: rows.slice(0, count).map(r => r.video),
        })
        return response
      }
      catch (e) {
        const error = `debbie.codes could not read videos right now (${(e as Error).message}). Try again.`
        announceListVideos({ error })
        return { error }
      }
    },
  }, { signal })
}
