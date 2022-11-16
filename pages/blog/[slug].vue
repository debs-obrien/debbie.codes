<script setup>
const { path } = useRoute();

const article = await queryContent('blog').where({ _path: path }).findOne();

const [prev, next] = await queryContent('blog')
  .where({ published: { $ne: false }, featured: { $ne: true } })

  .only(['_path', 'title', 'description'])
  .findSurround(path);

useHead({
  title: article.title,
  meta: [
    { name: 'description', content: article.description },
    {
      hid: 'description',
      name: 'description',
      content: article.description
    },
    // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
    { property: 'og:site_name', content: 'Debbie Codes' },
    { hid: 'og:type', property: 'og:type', content: 'website' },
    {
      hid: 'og:url',
      property: 'og:url',
      content: 'https://debbie.codes'
    },
    {
      hid: 'og:title',
      property: 'og:title',
      content: article.title
    },
    {
      hid: 'og:description',
      property: 'og:description',
      content: article.description
    },
    {
      hid: 'og:image',
      property: 'og:image',
      content: article.image
    },
    // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
    { name: 'twitter:site', content: '@debs_obrien' },
    { name: 'twitter:card', content: 'summary_large_image' },
    {
      hid: 'twitter:url',
      name: 'twitter:url',
      content: 'https://debbie.codes'
    },
    {
      hid: 'twitter:title',
      name: 'twitter:title',
      content: article.title
    },
    {
      hid: 'twitter:description',
      name: 'twitter:description',
      content: article.description
    },
    {
      hid: 'twitter:image',
      name: 'twitter:image',
      content: article.ogImage
    }
  ],
  link: [
    {
      hid: 'canonical',
      rel: 'canonical',
      href: `https://debbie.codes/${path}`
    }
  ]
});
</script>
<template>
  <main class="p-4 max-w-5xl m-auto">
    <header v-if="article" class="p-4 pb-12">
      <div class="img-cont h-72 mb-12">
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
      <h1 class="font-extrabold text-5xl mb-4">{{ article.title }}</h1>
      <p class="font-medium text-lg">{{ article.description }}</p>
      <ul class="">
        <li
          class="inline-block"
          v-for="(tag, n) in article.tags"
          :key="article.title"
        >
          <NuxtLink
            :to="`/blog/tags/${tag}`"
            class="text-sm text-blue-500 uppercase flex pr-4"
          >
            {{ tag }}
          </NuxtLink>
        </li>
      </ul>
    </header>
    <hr />
    <section class="grid grid-cols-8">
      <aside class="col-span-full md:col-span-2 row-start-1 w-full pt-14">
        <BlogToc :links="article.body.toc.links" class="sticky top-20" />
      </aside>
      <article
        class="col-span-full md:col-span-6 md:col-start-1 md:row-start-1 prose w-full p-4 max-w-3xl m-auto"
      >
        <ContentRenderer :value="article" class="prose">
          <template #empty>
            <p>No content found.</p>
          </template>
        </ContentRenderer>
      </article>
    </section>

    <BlogPrevNext :prev="prev" :next="next" />
  </main>
</template>
