<template>
  <div class="flex">
    <div class="hidden lg:block lg:w-1/4">
      <div v-for="post in blogPosts" :key="post.slug">
        <nuxt-link :to="`/blog/${post.slug}`">
          {{ post.title }}
        </nuxt-link>
      </div>
    </div>
    <article class="w-full lg:w-3/4">
      <nuxt-link to="/blog/" class="lg:hidden block pb-4">
        Back to Blog List
      </nuxt-link>
      <h1 class="main-heading">
        {{ blogPost.title }}
      </h1>
      <div v-dompurify-html="$md.render(blogPost.body)" />
    </article>
  </div>
</template>

<script>
export default {
  async asyncData ({ params, payload }) {
    if (payload) { return { blogPost: payload } } else {
      return {
        blogPost: await require(`~/assets/content/blog/${params.blog}.json`)
      }
    }
  },
  computed: {
    blogPosts () {
      return this.$store.state.blogPosts
    }
  }
}
</script>
<style>
pre {
  margin: 10px 0;
  padding: 20px;
  background-color: black;
  color: white;
}
code {
  padding: 20px;
}
</style>
