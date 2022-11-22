<script setup lang="ts">
defineProps<{
  date: string
}>()
</script>

<template>
  <time
    :datetime="date"
    class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1 block"
  >
    {{ formatDate(date) }}
  </time>
</template>
