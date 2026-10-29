<script setup lang="ts">
import type { PodcastPreview } from '~/types'

withDefaults(defineProps<{
  list: Array<PodcastPreview>
  /** Eager-load the first cover (tag pages where the grid is LCP). */
  priorityFirst?: boolean
}>(), {
  priorityFirst: false,
})
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 gap-8" :class="list.length > 2 ? 'lg:grid-cols-3 xl:grid-cols-4' : ''">
    <PodcastCard
      v-for="(item, index) in list"
      :key="item.url || item.path"
      :item="item"
      :priority="priorityFirst && index === 0"
    />
  </div>
</template>
