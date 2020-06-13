<template>
  <div class="page-wrapper nuxt-content">
    <h1 class="main-heading">
      Welcome to my blog
    </h1>
    <ul>
      <li v-for="article of articles" :key="article.slug" class="pb-2">
        <NuxtLink :to="`/blog/${article.slug}`">
          {{ article.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>

export default {
  layout: 'blog',
  async asyncData ({ $content, params }) {
    const articles = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('date', 'desc')
      .fetch()

    return {
      articles
    }
  }
}
</script>
