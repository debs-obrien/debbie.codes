<template>
  <nuxt-link
    :to="url"
    class="pr-4 text-nav text-2xl no-underline hover:underline"
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
  @apply text-black;
}
</style>
