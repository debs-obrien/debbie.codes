<template>
  <div class="border border-gray-300 p-6 rounded-lg">
    <h2 class="text-xl  font-medium title-font mb-2">
      {{ tip.title }}
    </h2>
    <p class="leading-relaxed text-base">
      <nuxt-content :document="page" class="mb-2" />
    </p>

    <div class="text-center leading-none flex justify-between w-full">
      <span
        v-for="tag in tip.tags"
        :key="tag"
        class=" mr-3 inline-flex items-center leading-none text-sm  py-1 "
      >
        {{ tag }}
      </span>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      tip: {
        type: Object,
        required: true
      },
      page: {
        type: Object,
        required: true
      }
    }
  }
</script>

<style scoped></style>
