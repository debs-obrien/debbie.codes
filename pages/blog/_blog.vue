<template>
  <article>
    <nuxt-link to="/blog/">Blog List</nuxt-link>
    <h1>{{ title }}</h1>
    <div v-html="body" />
  </article>
</template>

<script>
export default {
  async asyncData({ params, payload }) {
    const data = payload || (await require(`~/.nuxt/data/${params.blog}`))
    data.body = data.blarg // md.render(data.body)
    return data
  },
}
</script>
