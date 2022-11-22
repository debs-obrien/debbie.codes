<script setup lang="ts">
import type { Sections } from '~/types'

const { path } = useRoute()

const article = await queryContent('blog').where({ _path: path }).findOne()

const [prev, next]: any = await queryContent('blog')
  .where({ published: { $ne: false }, featured: { $ne: true } })
  .only(['_path', 'title', 'description', 'date'])
  .findSurround(path)

const section: Sections = 'blog'

useHead({
  title: article.title,
  meta: [
    { name: 'description', content: article.description },
    {
      hid: 'description',
      name: 'description',
      content: article.description,
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Debbie Codes' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      hid: 'og:url',
      property: 'og:url',
      content: 'https://debbie.codes',
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: article.title,
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: article.description,
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: article.image,
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: 'https://debbie.codes',
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: article.title,
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: article.description,
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: article.ogImage,
    },
  ],
  link: [
    {
      hid: 'canonical',
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
    <article>
      <header v-if="article" class="p-4">
        <h1 class="font-extrabold text-xl lg:text-5xl mb-1 lg:mb-2">
          {{ article.title }}
        </h1>

        <Date :date="article.date" />
      </header>
      <div class="rounded h-32 lg:h-72 mb-2 lg:mb-8 overflow-hidden object-cover object-center">
        <NuxtImg
          :provider="article.provider"
          :src="article.image"
          :alt="article.title"
          width="960"
          height="288"
          fit="thumb"
          format="webp"
          class="rounded"
        />
      </div>
      <section aria-label="summary">
        <p class="font-medium text-lg mb-4">
          {{ article.description }}
        </p>
      </section>
      <TagsList :tags="article.tags" :section="section" />

      <hr>
      <div class="grid grid-cols-8">
        <aside class="col-span-full md:col-span-2 row-start-1 w-full pt-8">
          <BlogToc :links="article.body.toc.links" class="sticky top-20" />
        </aside>
        <div
          class="col-span-full md:col-span-6 md:col-start-1 md:row-start-1 prose w-full p-4 max-w-3xl m-auto"
        >
          <ContentRenderer :value="article" class="prose">
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
