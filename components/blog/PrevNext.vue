<script setup lang="ts">
import type { PrevNext } from '~/types'

defineProps<{
  prev: PrevNext
  next: PrevNext
}>()
</script>

<template>
  <div
    class="flex gap-4 justify-between p-4 mt-6 border border-slate-200 rounded-lg"
  >
    <div class="prev">
      <NuxtLink v-if="prev" :to="prev.path">
        <span> {{ prev.title }} </span>
      </NuxtLink>
    </div>
    <div class="next">
      <NuxtLink v-if="next" :to="next.path">
        <span> {{ next.title }} </span>
      </NuxtLink>
    </div>
  </div>
</template>
