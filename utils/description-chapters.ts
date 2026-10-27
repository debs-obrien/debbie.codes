export interface DescriptionChapter {
  time: number
  title: string
}

function parseStamp(stamp: string) {
  const parts = stamp.split(':').map(part => Number(part))
  if (parts.some(part => !Number.isInteger(part) || part < 0))
    return null
  if (parts.length === 2) {
    const [minutes, seconds] = parts
    if (minutes === undefined || seconds === undefined || seconds > 59)
      return null
    return minutes * 60 + seconds
  }
  if (parts.length === 3) {
    const [hours, minutes, seconds] = parts
    if (hours === undefined || minutes === undefined || seconds === undefined || minutes > 59 || seconds > 59)
      return null
    return hours * 3600 + minutes * 60 + seconds
  }
  return null
}

export function parseDescriptionChapters(description: string) {
  if (!description.trim())
    return []
  const chapters: DescriptionChapter[] = []
  const seen = new Set<number>()
  for (const line of description.split(/\r?\n/)) {
    const match = line.trim().match(/^(\d{1,2}:\d{2}(?::\d{2})?)(?: *[-\u2013\u2014:] +| +)(\S.*)$/)
    if (!match?.[1] || !match[2])
      continue
    const time = parseStamp(match[1])
    const title = match[2].replace(/\s+/g, ' ').trim()
    if (time == null || title.length < 2 || title.length > 100 || seen.has(time))
      continue
    if (/^https?:\/\//i.test(title))
      continue
    seen.add(time)
    chapters.push({ time, title })
  }
  chapters.sort((a, b) => a.time - b.time)
  return chapters.length >= 2 ? chapters : []
}
