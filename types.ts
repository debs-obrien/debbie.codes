import type { ParsedContent, MarkdownParsedContent } from '@nuxt/content/dist/runtime/types';
export type Sections = 'blog' | 'podcasts' | 'videos' | 'courses';

export interface Video extends ParsedContent {
  video: string,
  title: string,
  start?: number,
  date: Date,
  host?: string,
  conference?: string,
  tags: string[]
}

export interface Podcast extends ParsedContent {
  title: string,
  date: Date,
  description: string,
  url: string,
  tags: string[],
  host: string,
  image: string
}

export interface Course extends ParsedContent {
  title: string,
  date: Date,
  description: string,
  url: string,
  tags: string[],
  provider: string,
  image: string,
  platform: string,
}

export interface BlogPost extends MarkdownParsedContent {
  title: string,
  date: Date,
  description: string,
  url?: string,
  image: string,
  ogimage: string,
  provider: string,
  tags: string[],
  published: boolean
}

export type BlogPostPreview = Omit<BlogPost, 'body'>;
export type PodcastPreview = Omit<Podcast, 'body'>;
export type VideoPreview = Omit<Video, 'body'>;
export type CoursePreview = Omit<Video, 'body'>;

export interface PrevNext {
  title?: string,
  path?: string
}

export interface Navigation {
  url: string,
  link: string
}
