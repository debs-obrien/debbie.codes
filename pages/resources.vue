<template>
  <article>
    <h1 class="main-heading">
      {{ page.title }}
    </h1>
    <nuxt-content :document="page" />
  </article>
</template>
<script>
export default {
  async asyncData ({ $content }) {
    const page = await $content('resources').fetch()

    return {
      page
    }
  }
}
</script>
