/**
 * Read YouTube chapter markers the player already exposes (from the
 * creator's description timestamps). Never invents chapters.
 */
export interface FetchedChapter {
  time: number
  title: string
}

function titleText(value: unknown): string {
  if (typeof value === 'string')
    return value.trim()
  if (!value || typeof value !== 'object')
    return ''
  const record = value as Record<string, unknown>
  if (typeof record.simpleText === 'string')
    return record.simpleText.trim()
  if (Array.isArray(record.runs)) {
    return record.runs
      .map(run => (run && typeof run === 'object' && typeof (run as { text?: unknown }).text === 'string'
        ? (run as { text: string }).text
        : ''))
      .join('')
      .trim()
  }
  return ''
}

function startSeconds(item: Record<string, unknown>): number | null {
  if (typeof item.timeRangeStartMillis === 'number' && Number.isFinite(item.timeRangeStartMillis))
    return Math.trunc(item.timeRangeStartMillis / 1000)
  const dump = JSON.stringify(item)
  const match = dump.match(/"startTimeSeconds"\s*:\s*"?(\d+)"?/)
  if (!match?.[1])
    return null
  return Number(match[1])
}

function walkChapters(node: unknown, out: FetchedChapter[], seen: Set<number>) {
  if (!node || typeof node !== 'object')
    return
  if (Array.isArray(node)) {
    for (const entry of node)
      walkChapters(entry, out, seen)
    return
  }
  const record = node as Record<string, unknown>
  const item = (record.chapterRenderer || record.macroMarkersListItemRenderer) as Record<string, unknown> | undefined
  if (item) {
    const title = titleText(item.title)
    const time = startSeconds(item)
    if (title.length >= 2 && title.length <= 120 && time != null && time >= 0 && !seen.has(time)) {
      seen.add(time)
      out.push({ time, title: title.replace(/\s+/g, ' ').trim() })
    }
  }
  for (const value of Object.values(record))
    walkChapters(value, out, seen)
}

/** Chapters from youtubei/v1/next (same markers the watch page shows). */
export async function fetchYouTubePlayerChapters(videoId: string): Promise<FetchedChapter[]> {
  const response = await fetch('https://www.youtube.com/youtubei/v1/next?prettyPrint=false', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    },
    body: JSON.stringify({
      context: {
        client: {
          clientName: 'WEB',
          clientVersion: '2.20240101.00.00',
          hl: 'en',
          gl: 'US',
        },
      },
      videoId,
    }),
  })
  if (!response.ok)
    throw new Error(`YouTube next returned ${response.status}`)
  const data = await response.json()
  const chapters: FetchedChapter[] = []
  walkChapters(data, chapters, new Set())
  chapters.sort((a, b) => a.time - b.time)
  return chapters.length >= 2 ? chapters : []
}
