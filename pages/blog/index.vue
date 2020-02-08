<template>
  <section>
    <div v-for="post in blogPosts">
      <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
    </div>
  </section>
</template>

<script>
export default {
  computed: {
    blogPosts() {
      return this.$store.state.blogPosts
    },
  },
}
</script>

<style></style>
