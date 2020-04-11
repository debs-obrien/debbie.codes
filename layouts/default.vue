<template>
  <div class="">
    <TopBar />
    <div class="container mt-top-bar">
      <nuxt />
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
