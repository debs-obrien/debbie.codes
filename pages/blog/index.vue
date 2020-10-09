<template>
  <div class="page-wrapper nuxt-content">
    <h1 class="main-heading">
      Welcome to my blog
    </h1>

    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-3 lg:max-w-none">
      <div v-for="article of articles" :key="article.slug">
        <PostsCard :article="article" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const articles = await $content('articles')
        .sortBy('date', 'desc')
        .where({ published: { $ne: false } })
        .fetch()

      return {
        articles
      }
    }
  }
</script>
