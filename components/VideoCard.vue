<template>
  <div class="flex flex-col overflow-hidden flex-1 max-width h-full">
    <div class="video flex-shrink-0">
      <lite-youtube
        v-if="item.video && item.start"
        :videoid="item.video"
        :playlabel="item.title"
        :start="item.start"
      />
      <lite-youtube
        v-else-if="item.video"
        :videoid="item.video"
        :playlabel="item.title"
      />
    </div>
    <div class="flex-1 py-3 flex flex-col justify-between">
      <div class="flex-1">
        <h3 class="mt-2 text-xl leading-7 font-semibold">
          {{ item.title }}
        </h3>
        <div v-if="item.date" class="mt-3 mb-3 flex items-center">
          <div class="flex text-sm leading-5 py-0.5">
            {{ formatDate(item.date) }}
          </div>
        </div>
        <div>
          <span
            v-for="tag in item.tags"
            :key="tag"
            class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800 capitalize"
          >
            {{ tag }}
          </span>
        </div>
        <!-- <p v-if="description" class="mt-3 text-base leading-6 text-gray-500">
          {{ item.description }}
        </p> -->
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props: {
      description: {
        type: Boolean,
        default: true
      },
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
