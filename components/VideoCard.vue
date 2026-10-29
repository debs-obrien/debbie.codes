<script setup lang="ts">
import type { VideoPreview } from '~/types'

withDefaults(defineProps<{
  item: VideoPreview
  /** First visible card: skip content-visibility so the poster paints immediately. */
  priority?: boolean
}>(), {
  priority: false,
})
</script>

<template>
  <article
    class="flex flex-col overflow-hidden flex-1 max-width h-full"
    :class="{ 'video-card--lazy': !priority }"
  >
    <div
      class="h-full rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      <lite-youtube
        :videoid="item.video"
        :playlabel="item.title"
        :start="item.start ? item.start : 0"
        :style="youtubePosterStyle(item.video)"
      />

      <div class="p-6">
        <Date :date="item.date" />

        <p class="text-base font-medium text-gray-600 dark:text-gray-300 mb-3">
          {{ item.conference }}{{ item.host }}
        </p>

        <h3 class="my-3 text-base leading-6 text-gray-800 dark:text-gray-100 group-hover:text-primary">
          {{ item.title }}
        </h3>

        <TagsList :tags="item.tags" section="videos" />
      </div>
    </div>
  </article>
</template>

<style scoped>
/* Defer painting (and background poster fetch) for offscreen cards. */
.video-card--lazy {
  content-visibility: auto;
  contain-intrinsic-size: auto 360px;
}
</style>
