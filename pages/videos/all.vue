<script setup lang="ts">
import type { Sections } from '~/types'

const filteredVideos = ref<any[]>([])
const isSearchActive = ref(false)

// Get all videos to extract real tags
const { data: allVideos } = await useAsyncData('all-videos-for-tags-all-page', () => queryCollection('videos')
  .all())

const videoTags = computed(() => {
  if (!allVideos.value)
    return []

  const tagCounts = new Map<string, number>()

  allVideos.value.forEach((video: any) => {
    if (video.tags) {
      video.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    }
  })

  // Sort by count and return top tags
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)
})

const title: string = 'All Videos'
const description: string = ''
const section: Sections = 'videos'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Bar -->
    <BlogSearch
      :articles="allVideos || []"
      :default-articles="allVideos || []"
      @update:filtered-articles="filteredVideos = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Tag Section -->
    <section v-if="videoTags.length > 0" class="mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <NuxtLink
          v-for="(tag, index) in videoTags"
          :key="tag"
          :to="`/videos/tags/${tag}`"
          class="text-xs px-2.5 py-1 rounded-full font-medium hover:opacity-80 transition-opacity whitespace-nowrap" :class="[
            ['bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-200',
             'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200',
             'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-200',
             'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-200',
             'bg-pink-100 text-pink-700 dark:bg-pink-900 dark:text-pink-200',
             'bg-cyan-100 text-cyan-700 dark:bg-cyan-900 dark:text-cyan-200'][index % 6],
          ]"
        >
          #{{ tag.replace('-', ' ') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Videos Grid Section -->
    <section class="mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        All Videos
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredVideos.length }})
      </h2>
      <VideoList :list="filteredVideos.length ? filteredVideos : (allVideos || [])" />
    </section>
  </PageLayout>
</template>
