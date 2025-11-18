<script setup lang="ts">
import type { PodcastPreview } from '~/types'

defineProps<{
  list: Array<PodcastPreview>
}>()
</script>

<template>
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    <PodcastCard
      v-for="item in list"
      :key="item.url || item.path"
      :item="item"
    />
  </div>
</template>
