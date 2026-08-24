<script setup lang="ts">
import type { VideoPreview } from '~/types'

defineProps<{
  list: Array<VideoPreview>
}>()
</script>

<template>
  <ul
    class="mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2"
    :class="list.length > 2 ? 'lg:grid-cols-3 xl:grid-cols-4' : ''"
  >
    <li v-for="video of list" :key="video.video" data-test-id="interviews">
      <VideoCard :item="video" />
    </li>
  </ul>
</template>
