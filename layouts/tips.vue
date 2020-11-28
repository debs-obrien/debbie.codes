<template>
  <div class="">
    <TwitterHead :title="title" :description="description" />
    <TheTopBar />
    <div class="container mt-top-bar">
      <SearchInput search-item="tips" />
      <nuxt />
    </div>

    <TheFooter />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title: "Welcome to Debbie's tips",
        description:
          "Debbie's Tips for all sorts of things learnt along the way"
      }
    },
    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'desctiption',
            content: this.desctiption
          }
        ]
      }
    }
  }
</script>
