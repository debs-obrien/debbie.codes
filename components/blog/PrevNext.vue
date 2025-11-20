<script setup lang="ts">
import type { PrevNext } from '~/types'

defineProps<{
  prev: PrevNext
  next: PrevNext
}>()
</script>

<template>
  <nav aria-label="Blog post navigation" class="mt-16 mb-8">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
      <!-- Previous Post -->
      <NuxtLink
        v-if="prev"
        :to="prev.path"
        class="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600"
        :aria-label="`Previous post: ${prev.title}`"
      >
        <!-- Direction Indicator -->
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            Previous
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {{ prev.title }}
        </h3>

        <!-- Decorative gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent dark:group-hover:from-blue-400/10 transition-all duration-300 rounded-xl pointer-events-none" />
      </NuxtLink>

      <!-- Placeholder for Previous (when no prev exists) -->
      <div v-else class="hidden md:block" />

      <!-- Next Post -->
      <NuxtLink
        v-if="next"
        :to="next.path"
        class="group relative overflow-hidden rounded-xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] hover:border-blue-300 dark:hover:border-blue-600"
        :class="{ 'md:col-start-2': !prev }"
        :aria-label="`Next post: ${next.title}`"
      >
        <!-- Direction Indicator -->
        <div class="flex items-center justify-end gap-2 mb-3">
          <span class="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors">
            Next
          </span>
          <svg class="w-5 h-5 text-gray-400 dark:text-gray-500 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>

        <!-- Title -->
        <h3 class="text-base font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2 text-right">
          {{ next.title }}
        </h3>

        <!-- Decorative gradient overlay on hover -->
        <div class="absolute inset-0 bg-gradient-to-l from-blue-500/0 to-blue-500/0 group-hover:from-blue-500/5 group-hover:to-transparent dark:group-hover:from-blue-400/10 transition-all duration-300 rounded-xl pointer-events-none" />
      </NuxtLink>
    </div>
  </nav>
</template>
