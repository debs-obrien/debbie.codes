interface DateFormatOptions {
  year?: 'numeric' | '2-digit'
  month?: 'numeric' | '2-digit' | 'long' | 'short' | 'narrow'
  day?: 'numeric' | '2-digit'
  locale?: string
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