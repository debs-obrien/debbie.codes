<template>
  <div class="flex justify-between">
    <PostsCard v-if="prev" :article="prev" class="prev mr-2" />
    <span v-else>&nbsp;</span>
    <PostsCard v-if="next" :article="next" class="next ml-2" />
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
