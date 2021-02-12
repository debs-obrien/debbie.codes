<template>
  <div class="flex flex-col ">
    <div
      class="flex-1 bg-white px-4 mb-8 pb-2 flex justify-between rounded-lg shadow-lg overflow-hidden"
    >
      <NuxtLink :to="`/blog/${item.slug}`" class="block">
        <h4
          class="mt-2 text-xl leading-7 font-semibold text-gray-900 hover:text-gray-600"
        >
          {{ item.title }}
        </h4>
      </NuxtLink>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      item: {
        type: Object,
        required: true
      }
    }
  }
</script>
