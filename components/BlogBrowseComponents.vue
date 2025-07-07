<script setup lang="ts">
// Reusable component for Browse by Topic and Browse by Year sections
// Used across blog homepage, year pages, and topic pages for consistency

// Props for the component
interface Props {
  popularTags?: Array<{ tag: string; count: number; displayName?: string }>
  postYears?: Array<{ year: string; count: number }>
  showTags?: boolean
  showYears?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  showTags: true,
  showYears: true
})
</script>

<template>
  <div class="space-y-16">
    <!-- Browse by Topic Section -->
    <section v-if="showTags && popularTags && popularTags.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Browse by Topic</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="{ tag, count, displayName } in popularTags"
          :key="tag"
          :to="`/blog/tags/${tag}`"
          class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-4 text-center font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          <div class="font-semibold">{{ displayName || tag.replace('-', ' ') }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ count }} post{{ count !== 1 ? 's' : '' }}</div>
        </NuxtLink>
      </div>
    </section>
    
    <!-- Browse by Year Section -->
    <section v-if="showYears && postYears && postYears.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">Browse by Year</h2>
      <div class="mb-4 text-center">
        <p class="text-gray-600 dark:text-gray-400 mb-4">Explore posts from different years</p>
      </div>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="{ year, count } in postYears"
          :key="year"
          :to="`/blog/year/${year}`"
          class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-4 text-center font-medium text-gray-700 dark:text-gray-300 transition-colors border-2 border-transparent hover:border-blue-300 dark:hover:border-blue-600"
        >
          <div class="font-semibold text-lg">{{ year }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ count }} post{{ count !== 1 ? 's' : '' }}</div>
        </NuxtLink>
      </div>
      <div class="text-center mt-4">
        <p class="text-sm text-gray-500 dark:text-gray-400">Click any year to browse posts from that period</p>
      </div>
    </section>
  </div>
</template>