import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string(),
        date: z.string(),
        title: z.string(),
        description: z.string(),
        provider: z.string(),
        url: z.string().url(),
        ogimage: z.string(),
        published: z.boolean(),
      })
    }),
    courses: defineCollection({
      source: 'courses/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        url: z.string().url(),
        image: z.string(),
        provider: z.string(),
        tags: z.array(z.string()),
        platform: z.string()
      })
    }),
    openSource: defineCollection({
      source: 'open-source/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        url: z.string().url(),
        image: z.string(),
        tags: z.array(z.string())
      })
    }),
    podcasts: defineCollection({
      source: 'podcasts/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        url: z.string().url(),
        image: z.string(),
        tags: z.array(z.string()),
        host: z.string(),
        provider: z.string().default('cloudinary')
      })
    }),
    tips: defineCollection({
      source: 'tips/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        tags: z.array(z.string())
      })
    }),
    videos: defineCollection({
      source: 'videos/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        date: z.string(),
        description: z.string(),
        video: z.string(),
        tags: z.array(z.string()),
        host: z.string().optional(),
        conference: z.string().optional(),
        image: z.string()
      })
    }),
    about: defineCollection({
      source: 'about.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
      }),
    }),
  }
})
