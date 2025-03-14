<script setup lang="ts">
import type { BlogPost, PrevNext, Sections } from '~/types'

const { path } = useRoute()

const { data: article } = await useAsyncData(path.replace(/\/$/, ''),
  () => queryCollection('blog')
    .where('path', 'LIKE', path)
    .first(),
)
const targetPath = '/blog'
const { data } = await queryCollectionItemSurroundings(
    'blog',
  targetPath,
  {
    fields: ['title', 'description', 'navigation']
  }
)

const [prev, next] = data.value || []
const section: Sections = 'blog'
const title: string = article.value?.title || ''
const description: string = article.value?.description || ''
const image: string = article.value?.image || ''
const ogImage: string = article.value?.ogImage || ''

useHead({
  title: article.value?.title || '',
  meta: [
    { name: 'description', content: description },
    {
      name: 'description',
      content: description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Debbie Codes' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
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

        <Date :date="article.date" />
      </header>
      <div class="rounded mb-2 lg:mb-8 overflow-hidden object-cover object-center center">
        <NuxtImg
          :provider="article.provider"
          :src="article.image"
          :alt="article?.alt || article.title"
          width="900"
          height="600"
          fit="fill"
          format="webp"
          class="rounded center mx-auto"
        />
      </div>
        <div
          class="grid grid-cols-4 gap-x-4 md:grid-cols-8 lg:grid-cols-12 lg:gap-x-6 mx-auto max-w-7xl prose mb-24 break-words"
        >
          <ContentRenderer :value="article" class="col-span-10 col-start-2 text-lg font-normal">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>

      <BlogPrevNext :prev="prev" :next="next" />
    </article>
  </main>
</template>
