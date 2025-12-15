import { Feed } from 'feed'
import { queryCollection } from '@nuxt/content/server'

export default defineEventHandler(async (event) => {
  const siteUrl = 'https://debbie.codes'
  const author = {
    name: 'Debbie O\'Brien',
    email: 'debbie@debbie.codes',
    link: siteUrl,
  }

  const feed = new Feed({
    title: 'Debbie Codes',
    description: 'Debbie O\'Brien - Program Manager at Microsoft working on Playwright, with over 10 years experience in Frontend development. Writing about Playwright, testing, React, Nuxt and more.',
    id: siteUrl,
    link: siteUrl,
    language: 'en',
    image: `${siteUrl}/twitter-card.png`,
    favicon: `${siteUrl}/favicon.ico`,
    copyright: `All rights reserved ${new Date().getFullYear()}, Debbie O'Brien`,
    feedLinks: {
      rss2: `${siteUrl}/feed.xml`,
    },
    author,
  })

  // Query all published blog posts
  const posts = await queryCollection(event, 'blog')
    .order('date', 'DESC')
    .all()

  // Filter to only published posts and add to feed
  const publishedPosts = posts.filter((post: any) => post.published !== false)

  for (const post of publishedPosts) {
    const url = `${siteUrl}${post.path}`

    feed.addItem({
      title: post.title,
      id: url,
      link: post.canonical || url,
      description: post.description,
      date: new Date(post.date),
      author: [author],
      category: post.tags?.map((tag: string) => ({ name: tag })) || [],
    })
  }

  setHeader(event, 'Content-Type', 'application/xml')
  return feed.rss2()
})
