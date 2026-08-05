<script setup lang="ts">
import type { BlogPostPreview, Sections } from '~/types'

withDefaults(defineProps<{
  items: BlogPostPreview[]
  section: Sections
  /** Render the first post as a larger lead card */
  lead?: boolean
}>(), {
  lead: false,
})
</script>

<template>
  <BlogPostList :list="items" :lead="lead" />
</template>
