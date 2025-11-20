<script setup lang="ts">
import type { BlogPostPreview } from '~/types'

defineProps<{
  list: Array<BlogPostPreview>
}>()
</script>

<template>
  <div class="mt-12 space-y-4 max-w-4xl mx-auto">
    <article
      v-for="item of list"
      :key="item.path"
      class="group"
    >
      <NuxtLink
        :to="item.path"
        class="block p-6 bg-white dark:bg-slate-800 rounded-xl transition-all duration-300 group-hover:bg-gray-50 dark:group-hover:bg-slate-700/50"
      >
        <div>
          <h3 class="inline-flex items-center gap-3 text-xl font-bold text-gray-800 dark:text-white mb-2 leading-tight">
            <svg
              class="w-5 h-5 text-primary transition-all duration-300 opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              stroke-width="2"
            >
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            <span>{{ item.title }}</span>
          </h3>
          <p class="text-gray-600 dark:text-gray-400 mb-3 text-sm">
            {{ item.description }}
          </p>
          <div class="flex items-center justify-between">
            <div class="flex items-center text-xs text-gray-500 dark:text-gray-400">
              <Date :date="item.date" />
            </div>
            <TagsList :tags="item.tags" section="blog" />
          </div>
        </div>
      </NuxtLink>
    </article>
  </div>
</template>
