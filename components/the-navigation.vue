<template>
  <nuxt-link
    :to="url"
    class="p-4 m-1 bg-green-600 text-white hover:bg-green-900"
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
