<script setup lang="ts">
import type { BlogPostPreview, CoursePreview, PodcastPreview, Sections } from '~/types'

defineProps<{
  list: any[]
  section: Sections
  showImages?: boolean
}>()
</script>

<template>
  <ul class="py-6 m-auto max-w-4xl">
    <li v-for="item in list" :key="item.path" class="py-4 border-b">
      <Item :item="item" :section="section" :showImages="showImages" />
    </li>
  </ul>
</template>
