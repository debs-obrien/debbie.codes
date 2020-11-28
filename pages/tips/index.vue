<template>
  <div class="page-wrapper">
    <h1 class="main-heading">
      Welcome to my tips
    </h1>

    <div class="mt-12 grid gap-5 max-w-lg mx-auto lg:grid-cols-2 lg:max-w-none">
      <div v-for="tip of tips" :key="tip.slug">
        <TipCard :tip="tip" :page="tip" />
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    layout: 'tips',
    async asyncData({ $content, params }) {
      const tips = await $content('tips')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      return {
        tips
      }
    }
  }
</script>
