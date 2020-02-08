<template>
  <article>
    <h1>{{ blogPost.title }}</h1>
    <div>{{ blogPost.body }}</div>
  </article>
</template>
<script>
const getList = () =>
  import(/* webpackChunkName: "data-blog-list" */ '@/.nuxt/blogList').then(
    (m) => m.default || m
  )
// import posts from '@/assets/content/output/blogList'
export default {
  async asyncData() {
    const posts = await getList()
    return { posts: posts }
  },
}
</script>

<style></style>
