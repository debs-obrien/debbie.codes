<template>
  <div class="container">
    <nuxt-content :document="page" />
  </div>
</template>
<script>
export default {
  async asyncData ({ $content }) {
    const page = await $content('thank-you').fetch()

    return {
      page
    }
  }
}
</script>
