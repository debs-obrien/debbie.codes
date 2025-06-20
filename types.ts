export type Sections = 'blog' | 'podcasts' | 'videos' | 'courses';

interface BaseContent {
  title: string,
  date: string,
  description: string,
  tags: string[],
  image?: string,
  url?: string,
  path?: string
}

export interface Video extends BaseContent {
  video: string,
  start?: number,
  host?: string,
  conference?: string
}

export interface Podcast extends BaseContent {
  host: string,
  provider?: string
}

export interface Course extends BaseContent {
  provider: string,
  platform: string
}

export interface BlogPost extends BaseContent {
  ogimage?: string,
  provider?: string,
  published: boolean,
  canonical?: string
}

export type BlogPostPreview = BlogPost;
export type PodcastPreview = Podcast;
export type VideoPreview = Video;
export type CoursePreview = Course;

export interface PrevNext {
  title?: string,
  path?: string
}

export interface Navigation {
  url: string,
  link: string
}
