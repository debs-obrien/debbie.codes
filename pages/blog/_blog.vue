<template>
  <div class="flex">
    <div class="sidebar w-1/4">
      <div v-for="post in blogPosts">
        <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
      </div>
    </div>
    <article class="w-3/4">
      <h1 class="main-heading">{{ blogPost.title }}</h1>
      <div v-html="$md.render(blogPost.body)" />
    </article>
  </div>
</template>

<script>
export default {
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    },
  },
  async asyncData({ params, payload }) {
    if (payload) return { blogPost: payload }
    else
      return {
        blogPost: await require(`~/assets/content/blog/${params.blog}.json`),
      }
  },
}
</script>
