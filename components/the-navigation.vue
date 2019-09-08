<template>
  <nuxt-link
    :to="url"
    class="p-4 m-1 bg-green-600 text-white hover:bg-green-800 hover:text-white no-underline"
  >
    {{ link }}
  </nuxt-link>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
    },
    link: {
      type: String,
      default: '',
    },
  },
  data() {
    return {}
  },
}
</script>
<style scoped>
.nuxt-link-exact-active {
  @apply bg-green-800;
}
</style>
