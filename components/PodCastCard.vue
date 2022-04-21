<template>
  <div class="flex flex-rounded-lg shadow-lg overflow-hidden pb-4">
    <div class="w-full lg:flex bg-white">
      <div class="podcast">
        <a v-if="item.image" :href="item.url" rel="nofollow" target="_blank">
          <img :src="item.image" :alt="item.title" class="max-width" />
        </a>
      </div>
      <div class="flex-1 bg-white p-6 flex flex-col justify-between">
        <div class="flex-1">
          <h3 class="mt-2 text-xl leading-7 font-semibold text-gray-900">
            {{ item.title }}
          </h3>
          <div>
            <span
              v-for="tag in item.tags"
              :key="tag"
              class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
            >
              {{ tag }}
            </span>
          </div>
          <p class="mt-3 text-base leading-6 text-gray-500">
            {{ item.description }}
          </p>
        </div>
        <div v-if="item.date" class="mt-6 flex items-center">
          <div class="ml-3">
            <div class="flex text-sm leading-5 text-gray-500">
              {{ formatDate(item.date) }}
            </div>
          </div>
        </div>
      </div>
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
    },
    methods: {
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleDateString('en', options)
      }
    }
  }
</script>

<style scoped>
  .max-width {
    max-width: 450px;
  }
  .video {
    width: auto;
    height: auto;
  }
</style>
