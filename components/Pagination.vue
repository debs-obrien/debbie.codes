<template>
  <section id="prev-next" class="flex justify-center mt-4 space-x-2">
    <nuxt-link
      v-if="prevPage"
      :to="prevLink"
      class="py-2 px-4 bg-white text-gray-700 border border-gray-200 font-medium rounded hover:bg-gray-200"
    >
      Prev page
    </nuxt-link>
    <nuxt-link
      v-if="nextPage"
      :to="`${urlPrefix}/${pageNo + 1}`"
      class="py-2 px-4 bg-white text-gray-700 border border-gray-200 font-medium rounded hover:bg-gray-200"
    >
      Next page
    </nuxt-link>
  </section>
</template>

<script>
  export default {
    props: ['prevPage', 'nextPage', 'pageNo', 'urlPrefix'],
    computed: {
      prevLink() {
        return this.pageNo === 1
          ? this.urlPrefix
          : `${this.urlPrefix}/${this.pageNo - 1}`
      }
    }
  }
</script>

<style></style>
