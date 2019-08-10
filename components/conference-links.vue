<template>
  <div class="flex border border-gray-500 p-2 w-full">
    <img :src="img" :alt="alt" />
    <div class="p-2 border-l border-gray-500">
      <p>{{ place }}</p>
      <p>{{ type }}</p>
      <nuxt-link :to="url">{{ link }}</nuxt-link>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    url: {
      type: String,
      default: '',
      required: true,
    },
    img: {
      type: String,
      default: '',
      required: false,
    },
    alt: {
      type: String,
      default: '',
      required: false,
    },
    place: {
      type: String,
      default: '',
      required: true,
    },
    type: {
      type: String,
      default: '',
      required: true,
    },
    link: {
      type: String,
      default: '',
      required: false,
    },
  },
}
</script>

<style scoped>
.wrapper {
  width: 900px;
  margin: 0 auto;
}
</style>
