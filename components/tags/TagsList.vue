<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  tags: Array<string>
  section: Sections
}>()
</script>

<template>
  <ul
    class="text-sm text-blue-600 dark:text-blue-500 uppercase flex flex-wrap"
  >
    <li
      v-for="tag in tags"
      :key="tag"
      class="whitespace-nowrap "
    >
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        class="hover:underline inline-block pr-2"
      >
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

