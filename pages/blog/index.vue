<template>
  <div>
    <div>
      <div v-for="post in posts">
        <nuxt-link :to="`/blog/${post.slug}`">{{ post.title }}</nuxt-link>
      </div>
    </div>
  </div>
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
