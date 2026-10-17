import { filterVisibleVideos } from '../videos'
import { MAX_OUTPUT_CHARS, webmcpTools } from './tools'

let controller: AbortController | undefined

function clip<T>(items: T[]): T[] {
  const out = [...items]
  while (out.length > 1 && JSON.stringify(out).length > MAX_OUTPUT_CHARS)
    out.pop()
  return out
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
    async execute(input: { tag?: string, conference?: string, host?: string, limit?: number } = {}) {
      try {
        const limit = Math.min(Math.max(Number(input.limit ?? 5) || 5, 1), 10)
        let q = queryCollection('videos')
          .select('title', 'date', 'conference', 'host', 'video', 'tags')
          .order('date', 'DESC')
        if (input.conference?.trim())
          q = q.where('conference', 'LIKE', `%${input.conference.trim()}%`)
        if (input.host?.trim())
          q = q.where('host', 'LIKE', `%${input.host.trim()}%`)
        let rows = await q.all()
        if (input.tag?.trim()) {
          const tag = input.tag.trim().toLowerCase()
          rows = rows.filter(r => r.tags?.map((x: string) => x.toLowerCase()).includes(tag))
        }
        rows = filterVisibleVideos(rows)
        if (!rows.length)
          return noMatchError(input)

        return {
          videos: clip(rows.slice(0, limit).map(r => ({
            title: r.title,
            date: r.date,
            link: `https://www.youtube.com/watch?v=${r.video}`,
            tags: r.tags ?? [],
            conference: r.conference ?? null,
            host: r.host ?? null,
          }))),
        }
      }
      catch (e) {
        return { error: `debbie.codes could not read videos right now (${(e as Error).message}). Try again.` }
      }
    },
  }, { signal })
}
