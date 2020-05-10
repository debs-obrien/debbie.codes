<template>
  <div>
    <ul>
      <li v-for="(article, index) in articles" :key="index + 'article'">
        <a :href="`/blog/${article.slug}`">{{ article.title }}</a>
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
