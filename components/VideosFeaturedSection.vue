<script setup lang="ts">
import type { VideoPreview } from '~/types'

defineProps<{
  list: Array<VideoPreview>
}>()
</script>

<template>
  <section
    v-if="list.length"
    class="animated-section mb-12"
    aria-labelledby="featured-videos-heading"
  >
    <h2
      id="featured-videos-heading"
      class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto"
    >
      Featured
    </h2>
    <ul class="mt-8 grid gap-10 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      <li
        v-for="(video, index) of list"
        :key="video.video"
      >
        <VideoCard
          :item="video"
          :priority="index === 0"
          :label="index === 0 ? 'Latest' : undefined"
        />
      </li>
    </ul>
  </section>
</template>
