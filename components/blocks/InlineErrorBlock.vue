<template>
  <div class="flex flex-col items-center p-2">
    <warning-icon />
    <h2 class="text-2xl pb-6">{{ error.message }}</h2>
    <nuxt-link to="/blog">Back to Blog</nuxt-link>
  </div>
</template>

<script>
import WarningIcon from '@/assets/icons/warning.svg?inline'

export default {
  components: {
    WarningIcon
  },
  props: {
    error: {
      type: Object,
      default: () => {}
    }
  }
}
</script>

<style lang="scss" scoped>
svg {
  width: 3rem;
  height: 3rem;
  margin-bottom: 1rem;
  opacity: 0.75;
}
.dark-mode svg path {
  fill: white;
}
</style>
