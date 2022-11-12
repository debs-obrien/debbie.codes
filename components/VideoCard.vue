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
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(date).toLocaleDateString('en', options);
    }
  }
};
</script>
<template>
  <div class="flex flex-col overflow-hidden flex-1 max-width h-full">
    <div
      class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"
    >
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
      <div class="p-6">
        <p
          class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
        >
          {{ formatDate(item.date) }}
        </p>

        <p class="text-md font-medium text-gray-600 mb-3">
          {{ item.conference }}{{ item.host }}
        </p>

        <h3 class="mt-3 text-base leading-6 text-gray-500">
          {{ item.title }}
        </h3>
        <!-- <ul v-for="tag in item.tags" class="inline-block">
            <li class="text-xs text-blue-500 uppercase flex pr-4">
              {{ tag }}
            </li>
          </ul> -->
      </div>
    </div>
  </div>
</template>
