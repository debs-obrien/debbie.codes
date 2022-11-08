<script setup>
const { path } = useRoute();

const article = await queryContent('blog').where({ _path: path }).findOne();

const [prev, next] = await queryContent('blog')
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
          :loading="article.loading ? article.loading : 'lazy'"
          preset="blog"
          width="auto"
          height="auto"
          sizes="sm:355px md:320px lg:480px"
          class="rounded-2xl h-full w-full object-cover"
        />
      </div>
      <h1 class="font-extrabold text-5xl">{{ article.title }}</h1>
      <p class="font-medium text-lg">{{ article.description }}</p>
      <ul class="article-tags">
        <li class="tag" v-for="(tag, n) in article.tags" :key="n">
          <NuxtLink :to="`/blog/tags/${tag}`" class="font-semibold">
            {{ tag }}
          </NuxtLink>
        </li>
      </ul>
    </header>
    <hr />
    <section class="grid grid-cols-8">
      <aside class="col-span-full md:col-span-2 row-start-1 w-full pt-14">
        <Toc :links="article.body.toc.links" class="sticky top-20" />
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

    <PrevNext :prev="prev" :next="next" />
  </main>
</template>
