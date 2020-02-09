<template>
  <article>
    <nuxt-link to="/blog/">Blog List</nuxt-link>
    <h1>{{ title }}</h1>
    <div v-html="body" />
  </article>
</template>

<script>
const getData = (params) =>
  import(
    /* webpackChunkName: "data-blog-[request]" */ `~/.nuxt/data/${params.blog}`
  ).then((m) => m.default || m)
export default {
  asyncData({ params }) {
    return getData(params)
  },
}
</script>
