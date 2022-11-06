<template>
  <div class="h-full bg-white">
    <div class="podcast p-4">
      <a v-if="item.image" :href="item.url" rel="nofollow" target="_blank">
        <img :src="item.image" :alt="item.title" />
      </a>

      <div class="flex-1">
        <a v-if="item.image" :href="item.url" rel="nofollow" target="_blank">
          <h3 class="mt-2 text-l leading-7 font-semibold text-gray-900">
            {{ item.title }}
          </h3>
        </a>
        <div v-if="item.date" class="mt-6 flex items-center">
          <div class="ml-3">
            <div class="flex text-sm leading-5 text-gray-500">
              {{ formatDate(item.date) }}
            </div>
          </div>
        </div>
        <span
          v-for="tag in item.tags"
          :key="tag"
          class="inline-flex items-center px-3 py-0.5 mr-2 rounded-full text-sm font-medium leading-5 bg-indigo-100 text-indigo-800"
        >
          {{ tag }}
        </span>
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
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en', options);
    }
  }
};
</script>
