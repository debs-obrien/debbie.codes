<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  list: any[]
  section: Sections
}>()
</script>

<template>
  <ul
    class="mt-12 grid gap-6 mx-auto md:grid-cols-2"
  >
    <li
      v-for="item of list"
      :key="item.url || item.path"
      class="flex flex-col"
    >
      <Card :item="item" :section="section" />
    </li>
  </ul>
</template>
