<script setup lang="ts">
import type { BlogPostPreview } from '~/types'
import { calculateReadingTime, extractTextFromContent, formatReadingTime } from '~/utils/reading-time'

const props = withDefaults(defineProps<{
  list: Array<BlogPostPreview>
  /** Render the first post as a larger lead card */
  lead?: boolean
}>(), {
  lead: false,
})

function readingTimeForItem(item: BlogPostPreview): string | null {
  const text = extractTextFromContent((item as any).body)
    || extractTextFromContent((item as any).content)
    || item.description
    || ''
  if (!text)
    return null
  return formatReadingTime(calculateReadingTime(text))
}

/** Precompute once per list so template lookups are O(1). */
const readingTimeByPath = computed(() => {
  const labels = new Map<string, string | null>()
  for (const item of props.list)
    labels.set(item.path, readingTimeForItem(item))
  return labels
})

function isLead(index: number) {
  return Boolean(props.lead && index === 0)
}
</script>

<template>
  <div class="mt-8 space-y-3 max-w-4xl mx-auto">
    <article
      v-for="(item, index) of list"
      :key="item.path"
      class="group rounded-xl bg-white dark:bg-slate-800/80 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50"
      :class="isLead(index) ? 'p-8' : 'p-6'"
    >
      <NuxtLink
        :to="item.path"
        class="block"
      >
        <h3
          class="inline-flex items-center gap-3 font-bold text-gray-800 dark:text-white leading-tight group-hover:text-primary transition-colors"
          :class="isLead(index) ? 'text-2xl sm:text-3xl mb-3' : 'text-xl mb-2'"
        >
          <svg
            class="text-primary transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
            :class="isLead(index) ? 'w-6 h-6' : 'w-5 h-5'"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
          <span>{{ item.title }}</span>
        </h3>
        <p
          class="text-gray-600 dark:text-gray-400"
          :class="isLead(index) ? 'mb-4 text-base' : 'mb-3 text-sm'"
        >
          {{ item.description }}
        </p>
      </NuxtLink>
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div class="flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <Date :date="item.date" />
          <span v-if="readingTimeByPath.get(item.path)">
            {{ readingTimeByPath.get(item.path) }}
          </span>
        </div>
        <TagsList :tags="item.tags" section="blog" />
      </div>
    </article>
  </div>
</template>
