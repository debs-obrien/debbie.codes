<template>
  <div class="page-wrapper">
    <username-articles-block />
  </div>
</template>

<script>
import UsernameArticlesBlock from '@/components/blocks/UsernameArticlesBlock'

export default {
  components: {
    UsernameArticlesBlock
  }
}
</script>

<style lang="scss" scoped>
.page-wrapper {
  max-width: $screen-xl;
  margin: auto;
  padding: 1rem;
}
</style>
