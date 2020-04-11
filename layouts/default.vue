<template>
  <div class="">
    <TopBar />
    <div class="container mt-top-bar">
      <nuxt keep-alive />
    </div>
  </div>
</template>

<script>
import TopBar from '@/components/top-bar'

export default {
  components: {
    TopBar
  }
}
</script>
