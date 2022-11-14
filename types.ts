export type Section = 'blog' | 'podcasts' | 'videos';

export interface Video {
  video: string;
  title: string;
  start?: number;
  date: string;
  host?: string;
  conference?: string;
  tags: string[];
  _path: string;
}

export interface Podcast {
  title: string;
  date: string;
  description: string;
  url: string;
  tags: string[];
  host: string;
  provider: string;
  image: string;
  _path: string;
}

export interface Course {
  title: string;
  date: string;
  description: string;
  url: string;
  tags: string[];
  provider: string;
  image: string;
  platform: string;
  _path: string;
}

export interface BlogPost {
  title: string;
  date: string;
  description: string;
  url?: string;
  image: string;
  alt: string;
  ogImage?: string;
  provider: string;
  tags: string[];
  host: string;
  published?: boolean;
  loading?: 'loading' | 'eager';
  _path: string;
}
