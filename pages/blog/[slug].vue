<script setup lang="ts">
import type { BlogPost, PrevNext, Sections } from '~/types'

const { path } = useRoute()

const { data: article } = await useAsyncData(path.replace(/\/$/, ''),
  () => queryContent<BlogPost>('blog')
    .where({ _path: path })
    .findOne(),
)

const { data } = await useAsyncData('prev-next',
  () => queryContent<PrevNext>('blog')
    .where({ published: { $ne: false }, featured: { $ne: true } })
    .sort({ date: -1 })
    .only(['_path', 'title'])
    .findSurround(path),
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
      <header v-if="article" class="py-4">
        <h1 class="font-extrabold text-xl lg:text-5xl mb-1 lg:mb-2">
          {{ article.title }}
        </h1>

        <Date :date="article.date" />
      </header>
      <div class="rounded h-32 lg:h-72 mb-2 lg:mb-8 overflow-hidden object-cover object-center center">
        <NuxtImg
          :provider="article.provider"
          :src="article.image"
          :alt="article?.alt || article.title"
          width="1024"
          height="288"
          fit="fill"
          format="webp"
          class="rounded"
        />
      </div>
      <section aria-label="summary">
        <p class="font-medium text-lg mb-4">
          {{ article.description }}
        </p>
      </section>
      <TagsList class="mb-2" :tags="article.tags" :section="section" />

      <hr>
      <div class="grid grid-cols-8 mt-4">
        <aside class="col-span-full md:col-span-2 row-start-1 w-full pt-8">
          <BlogToc :links="article.body.toc.links" class="sticky top-20" />
        </aside>
        <div
          class="col-span-full md:col-span-6 md:col-start-1 md:row-start-1 prose w-full pr-4 max-w-3xl m-auto"
        >
          <ContentRenderer :value="article">
            <template #empty>
              <p>No content found.</p>
            </template>
          </ContentRenderer>
        </div>
      </div>

      <BlogPrevNext :prev="prev" :next="next" />
    </article>
  </main>
</template>
