interface DateFormatOptions {
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  locale?: string
}

/**
 * Normalize a content date to an HTML <time datetime> calendar value (YYYY-MM-DD).
 * Prefers an explicit date prefix so timezone conversion cannot shift the day.
 */
export function toIsoDate(date: string): string {
  const trimmed = (date || '').trim()
  if (!trimmed)
    return ''
  const ymd = trimmed.match(/^(\d{4}-\d{2}-\d{2})/)
  if (ymd)
    return ymd[1]
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime()))
    return ''
  return parsed.toISOString().slice(0, 10)
}

/**
 * Calendar year from a content date string (YYYY-…), without timezone shifting.
 * `new Date('2023-01-01').getFullYear()` can return 2022 in US timezones.
 */
export function calendarYear(date: string): string {
  const trimmed = (date || '').trim()
  const match = trimmed.match(/^(\d{4})/)
  if (match)
    return match[1]
  const parsed = new Date(trimmed)
  if (Number.isNaN(parsed.getTime()))
    return ''
  return String(parsed.getUTCFullYear())
}

export function formatDate(dateString: string, options: DateFormatOptions = {}) {
  const {
    year = 'numeric',
    month = 'long',
    day = 'numeric',
    locale = 'en-US',
  } = options

  try {
    // Prefer the calendar YMD from frontmatter so SSR (UTC) and the browser
    // (local TZ) format the same day: avoids hydration mismatches on <time>.
    const iso = toIsoDate(dateString)
    if (!iso)
      return ''
    const [y, m, d] = iso.split('-').map(Number)
    const date = new Date(y, m - 1, d)
    if (Number.isNaN(date.getTime()))
      return ''

    return date.toLocaleDateString(locale, { year, month, day })
  }
  catch {
    return ''
  }
}
