<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  tags: Array<string>
  section: Sections
}>()
</script>

<template>
  <ul class="flex flex-wrap gap-2">
    <li
      v-for="tag in tags"
      :key="tag"
    >
      <TagChip
        :to="`/${section}/tags/${tag}`"
        :label="replaceHyphen(tag)"
        hash
        variant="text"
      />
    </li>
  </ul>
</template>
