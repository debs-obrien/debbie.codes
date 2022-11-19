<script setup lang="ts">
import type { BlogPost, Course, Podcast, Sections } from '~/types'
defineProps<{
  list: Array<BlogPost | Podcast | Course>
  section: Sections
}>()
</script>

<template>
  <ul class="p-4 py-6 m-auto max-w-4xl">
    <li v-for="item in list" :key="item._path" class="py-4 border-b">
      <Item :item="item" :section="section" />
    </li>
  </ul>
</template>
