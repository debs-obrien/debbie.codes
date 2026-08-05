<script setup lang="ts">
import type { BlogPostPreview, Sections } from '~/types'

defineProps<{
  items: BlogPostPreview[]
  section: Sections
}>()
</script>

<template>
  <BlogPostList :list="items" />
</template>
