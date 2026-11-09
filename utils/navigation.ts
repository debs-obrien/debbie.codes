import type { Navigation } from '~/types'

const allNavLinks: Navigation[] = [
  {
    url: '/about',
    link: 'About',
  },
  {
    url: '/speaking',
    link: 'Speaking',
  },
  {
    url: '/videos',
    link: 'Videos',
  },
  {
    url: '/podcasts',
    link: 'Podcasts',
  },
  {
    url: '/courses',
    link: 'Courses',
  },
  {
    url: '/blog',
    link: 'Blog',
  },
  {
    url: '/now',
    link: 'Now',
    // Temporarily hide from nav; revert by removing `hidden` (page + sitemap stay live).
    hidden: true,
  },
  {
    url: '/hire-me',
    link: 'Hire me',
  },
]

/** Links shown in desktop top bar, mobile dialog nav, and footer. */
export const NavLinks: Navigation[] = allNavLinks.filter(nav => !nav.hidden)
