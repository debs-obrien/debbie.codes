/**
 * Field lists for list, search, and tag pages.
 * Search only matches title, description, and tags — never fetch full markdown bodies.
 */

/**
 * Posts with `published: false` stay in the repo but must not appear in lists,
 * search, tags, surrounds, RSS, or the post route. Missing `published` means
 * published (legacy posts) — same rule as feed/sitemap (`!== false`).
 *
 * SQL: AND (published = true OR published IS NULL)
 */
export function onlyPublished<T extends {
  where: (field: string, operator: string, value?: unknown) => T
  orWhere: (groupFactory: (query: T) => unknown) => T
}>(query: T): T {
  return query.orWhere(q => q.where('published', '=', true).where('published', 'IS NULL'))
}

export const blogPreviewFields = [
  'path',
  'title',
  'description',
  'date',
  'tags',
  'image',
  'provider',
  'url',
  'canonical',
] as const

export const videoPreviewFields = [
  'path',
  'title',
  'description',
  'date',
  'tags',
  'video',
  'start',
  'host',
  'conference',
  'image',
  'featured',
  'featuredOrder',
] as const

export const podcastPreviewFields = [
  'path',
  'title',
  'description',
  'date',
  'tags',
  'url',
  'image',
  'host',
  'provider',
  'featured',
] as const

export const coursePreviewFields = [
  'path',
  'title',
  'description',
  'date',
  'tags',
  'url',
  'image',
  'provider',
  'platform',
] as const
