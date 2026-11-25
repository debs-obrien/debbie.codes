/**
 * Coffee with Debbie show data. Chapters match live YouTube player markers
 * from fetchYouTubePlayerChapters('RKdxx2QsWe8') (verified 2026-11-25).
 */

export const COFFEE_SHOW_VIDEO_ID = 'RKdxx2QsWe8'

export interface ShowChapter {
  time: number
  title: string
}

export interface ShowEpisode {
  number: number
  title: string
  date: string
  duration: string
  short: string
  blogPath: string
  videoId: string
  chapters: ShowChapter[]
}

/** Format seconds as m:ss / mm:ss for chapter labels. */
export function formatChapterTime(seconds: number): string {
  const total = Math.max(0, Math.trunc(seconds))
  const m = Math.floor(total / 60)
  const s = total % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

export const coffeeWithDebbieChapters: ShowChapter[] = [
  { time: 0, title: 'Intro' },
  { time: 33, title: 'Why tech hiring feels broken' },
  { time: 93, title: 'DevRel travel expectations' },
  { time: 263, title: 'The San Francisco bias' },
  { time: 400, title: 'The end of remote work?' },
  { time: 451, title: 'The toll of long interview loops' },
  { time: 545, title: 'Backup plans and staying passionate' },
  { time: 591, title: 'AI is shrinking startup teams' },
  { time: 675, title: 'How I apply for jobs with AI' },
  { time: 882, title: 'Recruiters and empathy' },
  { time: 972, title: 'The future of personal AI assistants' },
  { time: 1040, title: 'Bring back the human touch' },
  { time: 1112, title: 'Advice if you\'re job hunting' },
  { time: 1214, title: 'Outro' },
]

export const coffeeWithDebbieEpisodes: ShowEpisode[] = [
  {
    number: 1,
    title: 'Is Tech Hiring Broken? Here\'s What I\'m Seeing',
    date: '2026-11-24',
    duration: '20 min 40 sec',
    short: 'Why I think hiring in tech is broken, DevRel travel, the San Francisco bias, how I apply for jobs with AI, and why we need the human touch.',
    blogPath: '/blog/coffee-with-debbie-1-is-tech-hiring-broken',
    videoId: COFFEE_SHOW_VIDEO_ID,
    chapters: coffeeWithDebbieChapters,
  },
]

export const coffeeShowCover = {
  src600: '/images/podcasts/coffee-with-debbie-cover-600.webp',
  src1200: '/images/podcasts/coffee-with-debbie-cover-1200.webp',
  jpg600: '/images/podcasts/coffee-with-debbie-cover-600.jpg',
  jpg1200: '/images/podcasts/coffee-with-debbie-cover-1200.jpg',
  og: '/images/podcasts/og-coffee-with-debbie-1200x630.png',
  alt: 'Coffee with Debbie cover art',
}

export const coffeeListenLinks = {
  spotify: 'https://open.spotify.com/show/18L8sfkO2opyo4WKKaLxAA',
  youtube: 'https://youtu.be/RKdxx2QsWe8',
} as const
