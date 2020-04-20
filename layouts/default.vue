<template>
  <div class="">
    <TopBar />
    <div class="container mt-top-bar">
      <nuxt keep-alive />
    </div>

    <TheFooter />
  </div>
</template>

<script>
import TopBar from '@/components/top-bar'
import TheFooter from '@/components/the-footer'
export default {
  components: {
    TopBar,
    TheFooter
  }
}
</script>
