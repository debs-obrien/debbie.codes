<template>
  <div class="">
    <TheTopBar />
    <div class="container mt-top-bar">
      <nuxt keep-alive />
    </div>

    <TheFooter />
  </div>
</template>

<script>
import TheTopBar from '@/components/TheTopBar'
import TheFooter from '@/components/TheFooter'
export default {
  components: {
    TheTopBar,
    TheFooter
  }
}
</script>
