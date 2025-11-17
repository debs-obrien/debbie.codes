<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  tags: Array<string>
  section: Sections
}>()

// Color palette for tags
const colors = [
  'text-blue-500',
  'text-green-500',
  'text-purple-500',
  'text-orange-500',
  'text-pink-500',
  'text-cyan-500',
]

const getTagColor = (index: number) => colors[index % colors.length]
</script>

<template>
  <ul class="flex flex-wrap gap-3">
    <li
      v-for="(tag, index) in tags"
      :key="tag"
      class="whitespace-nowrap"
    >
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        :class="['hover:opacity-70 transition-opacity', getTagColor(index)]"
      >
        #{{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

