<script setup lang="ts">
import type { BlogPost } from '~/types'
defineProps<{
  prev: BlogPost
  next: BlogPost
}>()
</script>

<template>
  <ul
    class="flex gap-4 justify-between p-4 mt-6 border border-slate-200 rounded-lg"
  >
    <li class="prev">
      <NuxtLink v-if="prev" :to="prev._path">
        <span> {{ prev.title }} </span>
      </NuxtLink>
    </li>
    <li class="next">
      <NuxtLink v-if="next" :to="next._path">
        <span> {{ next.title }} </span>
      </NuxtLink>
    </li>
  </ul>
</template>
