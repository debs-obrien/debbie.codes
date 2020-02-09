<template>
  <article>
    <div class="pb-2"><nuxt-link to="/blog/">Back to Blog List</nuxt-link></div>
    <h1 class="main-heading">{{ title }}</h1>
    <div v-html="$md.render(body)" />
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
