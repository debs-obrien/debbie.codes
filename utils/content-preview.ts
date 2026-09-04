/**
 * Field lists for list, search, and tag pages.
 * Search only matches title, description, and tags — never fetch full markdown bodies.
 */

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
