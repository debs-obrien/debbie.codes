<template>
  <div>
    <h1 class="main-heading">
      Blog List
    </h1>
    <div v-for="post in blogPosts" :key="post.slug" class="flex flex-wrap">
      <div class="mb-2">
        <nuxt-link :to="`/blog/${post.slug}`">
          <h2 class="sub-heading">
            {{ post.title }}
          </h2>
        </nuxt-link>
        <p>{{ post.description }}</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  computed: {
    blogPosts () {
      return this.$store.state.blogPosts
    }
  }
}
</script>
