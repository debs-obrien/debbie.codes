<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  tags: Array<string>
  section: Sections
}>()
</script>

<template>
  <div

    class="text-sm text-blue-600 dark:text-blue-500 uppercase flex"
  >
    <NuxtLink
      v-for="tag in tags"
      :key="tag"
      :to="`/${section}/tags/${tag}`"
      class="hover:underline inline-block pr-2"
    >
      {{ tag }}
    </NuxtLink>
  </div>
</template>

