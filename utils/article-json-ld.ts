import { toIsoDate } from '~/utils/date'

/**
 * Build schema.org Article JSON-LD for a blog post.
 * Keep this pure so Playwright (and future callers) can assert a stable shape.
 */
export interface ArticleJsonLdInput {
  title: string
  description: string
  /** ISO calendar date (YYYY-MM-DD) or any Date-parseable string */
  date: string
  url: string
  image?: string
  /** Reading time in whole minutes; emitted as ISO-8601 duration (e.g. PT5M) */
  readingTimeMinutes?: number
  tags?: string[]
}

export function buildArticleJsonLd(input: ArticleJsonLdInput) {
  const datePublished = toIsoDate(input.date)
  const image = (input.image || '').trim()

  const data: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': input.url,
    },
    author: {
      '@type': 'Person',
      name: 'Debbie O\'Brien',
      url: 'https://debbie.codes/about',
    },
    publisher: {
      '@type': 'Person',
      name: 'Debbie O\'Brien',
      url: 'https://debbie.codes',
    },
  }

  if (datePublished)
    data.datePublished = datePublished

  if (image)
    data.image = [image]

  if (input.readingTimeMinutes && input.readingTimeMinutes > 0)
    data.timeRequired = `PT${input.readingTimeMinutes}M`

  if (input.tags?.length)
    data.keywords = input.tags.join(', ')

  return data
}
