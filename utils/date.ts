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

export function formatDate(dateString: string, options: DateFormatOptions = {}) {
  const {
    year = 'numeric',
    month = 'long',
    day = 'numeric',
    locale = 'en-US'
  } = options

  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return ''
    }
    return date.toLocaleDateString(locale, { year, month, day })
  } catch {
    return ''
  }
} 