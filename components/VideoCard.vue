<template>
  <div class="flex flex-rounded-lg shadow-lg overflow-hidden">
    <!-- component -->
    <div class=" w-full lg:flex">
      <iframe
        v-if="item.video"
        width="300"
        height="150"
        :src="item.video"
        frameborder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen
      >
      </iframe>
      <a v-else-if="item.image" :href="item.url" rel="nofollow" target="_blank">
        <img :src="item.image" />
      </a>
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
        <h3 class="text-primary mt-2 text-xl leading-7 font-semibold inline">
          {{ item.title }}
        </h3>
        <span v-if="item.host"> with {{ item.host }} </span>

        <p class="mt-3 text-base leading-6 text-gray-500">
          {{ item.description }}
        </p>
      </div>
      <div v-if="item.date" class="flex items-center">
        <div class="p-3">
          <div class="flex text-sm leading-5 text-gray-500">
            {{ formatDate(item.date) }}
          </div>
          <div
            v-if="item.conference"
            class="flex text-sm leading-5 text-gray-500"
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
        default: () => {},
        required: false
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
  a {
    text-decoration: none;
  }
</style>
