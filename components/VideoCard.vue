<template>
  <div class="flex flex-rounded-lg shadow-lg overflow-hidden pb-4">
    <div class="w-full lg:flex">
      <div class="video">
        <lite-youtube
          v-if="item.video"
          :videoid="item.video"
          :playlabel="item.title"
        />

        <a
          v-else-if="item.image"
          :href="item.url"
          rel="nofollow"
          target="_blank"
        >
          <img :src="item.image" class="max-width" />
        </a>
      </div>

      <div class="flex-1 p-4">
        <div>
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
          >
            {{ tag }}
          </span>
        </div>
        <h2 class="text-primary mt-2 text-xl leading-7 font-semibold inline">
          {{ item.title }}
        </h2>
        <span v-if="item.host"> with {{ item.host }} </span>

        <p class="mt-3 text-lg leading-6 text-gray-500  dark:text-gray-300">
          {{ item.description }}
        </p>
      </div>
      <div v-if="item.date" class="flex items-center">
        <div class="p-3">
          <div class="flex text-sm leading-5 text-gray-500 dark:text-gray-300">
            {{ formatDate(item.date) }}
          </div>
          <div
            v-if="item.conference"
            class="flex text-sm leading-5 text-gray-500 dark:text-gray-300"
          >
            {{ item.conference }}
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
    max-width: 300px;
  }
  .video {
    width: 300px;
    height: 150px;
  }
</style>
