<script setup lang="ts">
import type { Video } from '~/types'
defineProps<{
  item: Video
}>()
</script>

<template>
  <div class="flex flex-col overflow-hidden flex-1 max-width h-full">
    <div
      class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"
    >
      <lite-youtube
        :videoid="item.video"
        :playlabel="item.title"
        :start="item.start ? item.start : 0"
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
      </div>
    </div>
  </div>
</template>
