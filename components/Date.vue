<script setup lang="ts">
const props = defineProps<{
  date: string
}>()

/** Machine-readable calendar date for <time datetime> (YYYY-MM-DD). */
const datetime = computed(() => toIsoDate(props.date))
</script>

<template>
  <time
    :datetime="datetime || undefined"
    class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1 block"
  >
    {{ formatDate(date) }}
  </time>
</template>
