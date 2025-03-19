<script setup lang="ts">
import type { BlogPost, PrevNext, Sections } from '~/types'

const { path } = useRoute()

const { data: article } = await useAsyncData(path.replace(/\/$/, ''),
  () => queryCollection('blog')
    .where('path', 'LIKE', path)
    .first(),
)

const { data } = await useAsyncData('surround', () => {
  return queryCollectionItemSurroundings('blog', path)
    .order('date', 'DESC')
})

const [prev, next] = data.value || []
const section: Sections = 'blog'
const title: string = article.value?.title || ''
const description: string = article.value?.description || ''
const image: string = article.value?.image || ''
const ogImage: string = article.value?.ogimage || ''

// Format date as string for the Date component
const formattedDate = article.value?.date ? new Date(article.value.date).toISOString().split('T')[0] : ''

useHead({
  title: article.value?.title || '',
  meta: [
    { name: 'description', content: description },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Debbie Codes' },
    { property: 'og:type', content: 'website' },
    {
      property: 'og:url',
      content: 'https://debbie.codes',
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
      content: ogImage || image,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      name: 'twitter:url',
      content: 'https://debbie.codes',
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
      content: ogImage || image,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: `https://debbie.codes/${path}`,
    },
  ],
})
</script>

<template>
  <main
    class="container mx-auto max-w-5xl"
  >
    <article v-if="article !== null">
      <header v-if="article" class="py-4 text-center">
        <h1 class="font-extrabold text-xl lg:text-5xl mb-1 lg:mb-2">
          {{ article.title }}
        </h1>

        <Date :date="formattedDate" />
      </header>
      <div class="rounded mb-2 lg:mb-8 overflow-hidden object-cover object-center center">
        <NuxtImg
          :provider="article.provider"
          :src="article.image"
          :alt="article.title"
          width="900"
          height="600"
          fit="fill"
          format="webp"
          class="rounded center mx-auto"
        />
      </div>
        <div class="prose mx-auto max-w-4xl mb-24 break-words">
          <ContentRenderer :value="article" class="text-lg font-normal">
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
