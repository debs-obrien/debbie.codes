<script setup lang="ts">
import { buildArticleJsonLd } from '~/utils/article-json-ld'
import { isStandardOgSize, resolveOgImage } from '~/utils/og-image'
import { calculateReadingTime, extractTextFromContent, formatReadingTime } from '~/utils/reading-time'

const route = useRoute()
const path = route.path.replace(/\/$/, '')
const slug = path.split('/').pop() || ''

const { data: article } = await useAsyncData(`blog-article-${path}`, () => queryCollection('blog')
  .where('path', '=', path)
  .first())

const { data } = await useAsyncData(`blog-surround-${path}`, () => {
  return queryCollectionItemSurroundings('blog', path)
    .order('date', 'DESC')
})

const [prev, next] = data.value || []
const title: string = article.value?.title || ''
const description: string = article.value?.description || ''
const image: string = article.value?.image || ''
// Prefer schema ogImage; also accept legacy meta.ogImage if content still nests it
const ogImageField: string
  = article.value?.ogImage
    || (article.value as { meta?: { ogImage?: string } } | null)?.meta?.ogImage
    || ''
const socialImage = resolveOgImage(ogImageField, image)
const socialImageHasStandardSize = isStandardOgSize(socialImage)
const canonicalUrl = article.value?.canonical || `https://debbie.codes${path}`
// Pass the raw frontmatter date so <time datetime> stays ISO (YYYY-MM-DD).
const articleDate = String(article.value?.date || '')

const readingMinutes = computed(() => {
  if (!article.value)
    return 0
  const text = extractTextFromContent(article.value.body) || article.value.description || ''
  if (!text)
    return 0
  return calculateReadingTime(text)
})

const readingTimeLabel = computed(() => {
  if (!readingMinutes.value)
    return ''
  return formatReadingTime(readingMinutes.value)
})

const articleJsonLd = computed(() => {
  if (!article.value || !title)
    return null
  return buildArticleJsonLd({
    title,
    description,
    date: articleDate,
    url: canonicalUrl,
    image: socialImage,
    readingTimeMinutes: readingMinutes.value || undefined,
    tags: article.value.tags,
  })
})

useHead({
  title: article.value?.title || '',
  meta: [
    { name: 'description', content: description },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Debbie Codes' },
    // Article (not website) — matches the JSON-LD @type and helps link previews.
    { property: 'og:type', content: 'article' },
    {
      property: 'og:url',
      content: `https://debbie.codes/blog/${slug}`,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: description,
    },
    {
      property: 'og:image',
      content: socialImage,
    },
    ...(socialImageHasStandardSize
      ? [
          { property: 'og:image:width', content: '1200' },
          { property: 'og:image:height', content: '630' },
        ]
      : []),
    { property: 'og:image:alt', content: title },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: `https://debbie.codes/blog/${slug}`,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: description,
    },
    {
      name: 'twitter:image',
      content: socialImage,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl,
    },
  ],
  script: computed(() => {
    if (!articleJsonLd.value)
      return []
    return [
      {
        key: 'article-json-ld',
        type: 'application/ld+json',
        // children (not innerHTML) is the Nuxt/unhead-safe way to emit JSON-LD
        children: JSON.stringify(articleJsonLd.value),
      },
    ]
  }),
})
</script>

<template>
  <main class="container mx-auto px-4 sm:px-6 max-w-5xl">
    <article v-if="article !== null">
      <div class="max-w-4xl mx-auto pt-4 sm:pt-6">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          ← Back to blog
        </NuxtLink>
      </div>

      <header v-if="article" class="py-4 sm:py-6 text-center">
        <h1 class="font-extrabold text-2xl sm:text-3xl lg:text-5xl mb-2 sm:mb-3">
          {{ article.title }}
        </h1>

        <div class="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 mb-3">
          <Date v-if="articleDate" :date="articleDate" />
          <span
            v-if="readingTimeLabel"
            class="tracking-widest text-xs title-font font-medium text-gray-600 dark:text-gray-400"
          >
            {{ readingTimeLabel }}
          </span>
        </div>

        <div v-if="article.tags?.length" class="flex justify-center">
          <TagsList :tags="article.tags" section="blog" />
        </div>
      </header>
      <div v-if="article.image" class="rounded mb-4 sm:mb-6 overflow-hidden object-cover object-center max-w-xl mx-auto">
        <NuxtImg
          :provider="article.provider"
          :src="article.image"
          :alt="article.title"
          width="600"
          height="300"
          fit="cover"
          format="webp"
          loading="eager"
          fetchpriority="high"
          decoding="async"
          :preload="{ fetchPriority: 'high' }"
          sizes="xs:100vw sm:576px"
          densities="x1 x2"
          class="rounded center mx-auto w-full"
        />
      </div>
      <div class="prose mx-auto max-w-4xl mb-16 sm:mb-20 lg:mb-24 break-words">
        <ContentRenderer :value="article" class="text-base sm:text-lg font-normal">
          <template #empty>
            <template v-if="article.url">
              <a :href="article.url" target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full text-primary hover:text-primary/80 transition-colors py-4">
                <span>Read on external site</span>
                <span class="ml-1">→</span>
              </a>
            </template>
            <template v-else>
              <p>No content found.</p>
            </template>
          </template>
        </ContentRenderer>
      </div>

      <BlogPrevNext :prev="prev" :next="next" />
    </article>
  </main>
</template>
