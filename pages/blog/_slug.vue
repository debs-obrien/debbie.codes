<template>
  <div>
    <h1>{{ page.title }}</h1>
    <p>{{ page.description }}</p>
    {{ stats.text }}
    <nuxt-content :document="page" />
    <div class="flex justify-between">
      <div>
        <a :href="`/blog/${prev.slug}`">Previous: {{ prev.title }}</a>
      </div>
      <div>
        <a :href="`/blog/${next.slug}`">Next: {{ next.title }}</a>
      </div>
    </div>
  </div>
</template>

<script>
const readingTime = require('reading-time')

export default {
  async asyncData({ $content, params }) {
    const slug = params.slug || 'index'
    const page = await $content('articles', slug).fetch()

    const [prev, next] = await $content('articles')
      .only(['title', 'slug'])
      .fetch()

    const stats = readingTime(page)

    return {
      page,
      prev,
      next,
      stats
    }
  }
}
</script>
