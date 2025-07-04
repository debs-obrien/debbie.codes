import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    blog: defineCollection({
      source: 'blog/*.md',
      type: 'page',
      schema: z.object({
        tags: z.array(z.string()),
        image: z.string().optional(),
        date: z.string(),
        title: z.string(),
        description: z.string(),
        provider: z.string().optional(),
        url: z.string().url().optional(),
        ogimage: z.string().optional(),
        published: z.boolean(),
        canonical: z.string().url().optional(),
        featured: z.boolean().optional()
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
        image: z.string(),
        featured: z.boolean().optional()
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
