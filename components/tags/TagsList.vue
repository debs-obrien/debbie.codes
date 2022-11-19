<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  tags: Array<string>
  section: Sections
}>()
</script>

<template>
  <ul
    v-for="tag in tags"
    :key="tag"
    class="inline-block"
  >
    <li class="text-sm text-blue-600 dark:text-blue-500 uppercase flex pr-2">
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        class="hover:underline"
      >
        {{ tag }}
      </NuxtLink>
    </li>
  </ul>
</template>

