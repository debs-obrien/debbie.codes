<!-- <template>
  <nuxt-content :document="page" />
</template>
<script>
export default {
  async asyncData ({ $content }) {
    const page = await $content('csscamp2019').fetch()

    return {
      page
    }
  }
}
</script>
<template>
  <article>
    <h1 class="main-heading">{{ page.title }}</h1>
    <nuxt-content :document="page" />
  </article>
</template>
<script>
export default {
  async asyncData({ $content }) {
    const page = await $content('jscamp2019').fetch()

    return {
      page
    }
  }
}
</script> -->
