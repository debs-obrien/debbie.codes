<script setup lang="ts">
import { buildArticleJsonLd } from '~/utils/article-json-ld'
import type { OgImageHost } from '~/utils/og-image'
import { isStandardOgSize, resolveOgImage } from '~/utils/og-image'
import { calculateReadingTime, extractTextFromContent, formatReadingTime } from '~/utils/reading-time'

const route = useRoute()
const path = route.path.replace(/\/$/, '')
const slug = path.split('/').pop() || ''
const ogImageHost = useRuntimeConfig().public.ogImageHost as OgImageHost

const { data: article } = await useAsyncData(`blog-article-${path}`, () => onlyPublished(queryCollection('blog'))
  .where('path', '=', path)
  .first())

// Match pages/[...slug].vue: HTTP 404 + shared NotFound UI (unpublished or missing).
if (!article.value) {
  const event = useRequestEvent()
  if (event)
    setResponseStatus(event, 404, 'Page Not Found')
}

const { data } = await useAsyncData(`blog-surround-${path}`, () => {
  if (!article.value)
    return Promise.resolve([null, null] as const)
  return onlyPublished(queryCollectionItemSurroundings('blog', path))
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
const socialImage = resolveOgImage(ogImageField, image, { host: ogImageHost })
const socialImageHasStandardSize = isStandardOgSize(socialImage)
const canonicalUrl = article.value?.canonical || `https://debbie.codes${path}`
// Pass the raw frontmatter date so <time datetime> stays ISO (YYYY-MM-DD).
const articleDate = String(article.value?.date || '')

const readingMinutes = computed(() => {
  if (!article.value)
    return 0
  // Same build-time value list cards select via blogPreviewFields.readingMinutes.
  if (typeof article.value.readingMinutes === 'number' && article.value.readingMinutes > 0)
    return article.value.readingMinutes
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

if (article.value) {
  useHead({
    title: article.value.title || '',
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
      {
        rel: 'alternate',
        type: 'text/markdown',
        href: `https://debbie.codes/blog/${slug}.md`,
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
}
</script>

<template>
  <NotFound v-if="!article" />
  <main v-else class="container mx-auto px-4 sm:px-6 max-w-5xl">
    <article>
      <div class="max-w-4xl mx-auto pt-4 sm:pt-6">
        <NuxtLink
          to="/blog"
          class="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
        >
          ← Back to blog
        </NuxtLink>
      </div>

      <header class="py-4 sm:py-6 text-center">
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
      <div v-if="article.video" class="max-w-4xl mx-auto mb-5">
        <a
          href="#watch-the-video"
          class="inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#d8002d] dark:text-[#ff5a73] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 12 12"
            width="12"
            height="12"
            aria-hidden="true"
            class="shrink-0"
          >
            <path fill="currentColor" d="M3 1.5v9l8-4.5L3 1.5z" />
          </svg>
          Prefer to watch? Jump to the video
        </a>
      </div>
      <div
        class="prose mx-auto max-w-4xl break-words"
        :class="article.video ? '' : 'mb-16 sm:mb-20 lg:mb-24'"
      >
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

      <section
        v-if="article.video"
        id="watch-the-video"
        tabindex="-1"
        class="max-w-4xl mx-auto mt-14 scroll-mt-top-bar border-t border-gray-300 dark:border-gray-700 pt-8 mb-16 sm:mb-20 lg:mb-24"
      >
        <h2 class="text-2xl font-bold mb-2">
          Watch the video
        </h2>
        <p class="text-gray-600 dark:text-gray-400 mb-6">
          The same walkthrough on video, if you would rather see it in action.
        </p>
        <ClientOnly>
          <lite-youtube
            :videoid="article.video"
            :playlabel="article.title"
            :style="youtubePosterStyle(article.video, 'sddefault')"
          />
        </ClientOnly>
        <a
          :href="youtubeWatchUrl(article.video)"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-block mt-4 text-[15px] font-semibold text-[#d8002d] dark:text-[#ff5a73] hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
        >
          Watch on YouTube
        </a>
      </section>

      <BlogPrevNext :prev="prev" :next="next" />
    </article>
  </main>
</template>
