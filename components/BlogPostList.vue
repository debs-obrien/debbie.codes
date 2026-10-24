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
  for (const item of props.list) {
    if (!item.path)
      continue
    labels.set(item.path, readingTimeForItem(item))
  }
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
      class="group rounded-xl bg-white dark:bg-slate-800/80 transition-colors duration-200 hover:bg-gray-50 dark:hover:bg-slate-700/50 p-6"
    >
      <!-- Lead: outer flex so meta sits in the text column beside the cover (no nested links). -->
      <template v-if="isLead(index)">
        <div
          :class="item.image ? 'sm:flex sm:items-center sm:gap-6' : ''"
        >
          <div
            v-if="item.image"
            data-testid="blog-card-cover"
            class="overflow-hidden rounded-lg aspect-[2/1] bg-gray-100 dark:bg-slate-700 mb-4 w-full max-h-[180px] sm:w-80 sm:shrink-0 sm:grow-0 sm:mb-0 sm:max-h-none"
          >
            <NuxtLink :to="item.path" class="block h-full w-full">
              <NuxtImg
                :provider="item.provider"
                :src="item.image"
                alt=""
                width="600"
                height="300"
                fit="cover"
                format="webp"
                loading="eager"
                fetchpriority="high"
                decoding="async"
                sizes="xs:100vw sm:320px"
                class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
              />
            </NuxtLink>
          </div>
          <div :class="item.image ? 'min-w-0 sm:flex-1' : ''">
            <NuxtLink :to="item.path" class="block text-left">
              <!-- Arrow is absolute so title shares the same left edge as excerpt/meta. -->
              <h3 class="relative text-left text-lg sm:text-2xl font-semibold mb-2 text-gray-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
                <svg
                  class="pointer-events-none absolute -left-6 top-1 w-5 h-5 text-primary transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  stroke-width="2"
                  aria-hidden="true"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
                <span class="line-clamp-2">{{ item.title }}</span>
              </h3>
              <p class="mb-3 text-left text-base line-clamp-2 text-gray-600 dark:text-gray-400">
                {{ item.description }}
              </p>
            </NuxtLink>
            <div class="flex flex-nowrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
              <Date :date="item.date" />
              <span v-if="readingTimeByPath.get(item.path)">
                {{ readingTimeByPath.get(item.path) }}
              </span>
            </div>
          </div>
        </div>
      </template>

      <!-- Compact cards (home + non-lead): unchanged layout -->
      <template v-else>
        <NuxtLink
          :to="item.path"
          class="block"
          :class="item.image ? 'sm:flex sm:items-start sm:gap-6' : ''"
        >
          <div
            v-if="item.image"
            data-testid="blog-card-cover"
            class="overflow-hidden rounded-lg aspect-[2/1] bg-gray-100 dark:bg-slate-700 mb-4 w-full sm:w-56 sm:shrink-0 sm:mb-0"
          >
            <NuxtImg
              :provider="item.provider"
              :src="item.image"
              alt=""
              width="600"
              height="300"
              fit="cover"
              format="webp"
              loading="lazy"
              decoding="async"
              sizes="xs:400px sm:224px"
              class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          </div>
          <div :class="item.image ? 'min-w-0 sm:flex-1' : ''">
            <!-- Arrow is absolute so title shares the same left edge as excerpt. -->
            <h3 class="relative font-bold text-xl mb-2 text-gray-800 dark:text-white leading-tight group-hover:text-primary transition-colors">
              <svg
                class="pointer-events-none absolute -left-6 top-1 w-5 h-5 text-primary transition-all duration-300 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0"
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
            <p class="mb-3 text-sm text-gray-600 dark:text-gray-400">
              {{ item.description }}
            </p>
          </div>
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
      </template>
    </article>
  </div>
</template>
