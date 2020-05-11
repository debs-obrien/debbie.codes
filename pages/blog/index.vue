<template>
  <div>
    <ul>
      <li v-for="(article, index) in articles" :key="index + 'article'">
        <NuxtLink :to="`/blog/${article.slug}`">{{ article.title }}</NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  async asyncData({ $content, params }) {
    const articles = await $content('articles')
      .only(['title', 'slug'])
      .sortBy('date')
      .fetch()

    return {
      articles
    }
  }
}
</script>
