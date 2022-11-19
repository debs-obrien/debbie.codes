<script setup lang="ts">
import type { BlogPost, Podcast } from '~/types'
defineProps<{
  list: any
}>()
</script>

<template>
  <ul
    class="mt-12 grid gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
  >
    <li
      v-for="item of list"
      :key="item.url || item._path"
      class="flex flex-col"
    >
      <Card :item="item" :description="false" />
    </li>
  </ul>
</template>

