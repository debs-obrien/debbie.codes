<script setup lang="ts">
const props = withDefaults(defineProps<{
  date: string
  /** Inline with surrounding text (no block/mb-1/tracking); for "date · duration" lines. */
  inline?: boolean
}>(), {
  inline: false,
})

/** Machine-readable calendar date for <time datetime> (YYYY-MM-DD). */
const datetime = computed(() => toIsoDate(props.date))
</script>

<template>
  <time
    :datetime="datetime || undefined"
    :class="inline
      ? 'inline'
      : 'tracking-widest text-xs title-font font-medium text-gray-600 dark:text-gray-400 mb-1 block'"
  >
    {{ formatDate(date) }}
  </time>
</template>
