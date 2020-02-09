<template>
  <div>
    <div>
      <div v-for="post in blogPosts">
        <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
      </div>
    </div>
  </div>
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
