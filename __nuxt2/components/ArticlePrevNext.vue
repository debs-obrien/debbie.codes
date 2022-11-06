<template>
  <div class="flex flex-col md:flex-row justify-between">
    <PrevNextPostsCard
      v-if="prev"
      :item="prev"
      class="prev xs:mb-8 md:mb-0 md:mr-2"
    />
    <span v-else>&nbsp;</span>
    <PrevNextPostsCard v-if="next" :item="next" class="next md:ml-2" />
    <span v-else>&nbsp;</span>
  </div>
</template>

<script>
  export default {
    props: {
      prev: {
        type: Object,
        default: () => null
      },
      next: {
        type: Object,
        default: () => null
      }
    }
  }
</script>
<style scoped>
  .prev,
  .next {
    width: 100%;
    max-width: 400px;
  }
</style>
