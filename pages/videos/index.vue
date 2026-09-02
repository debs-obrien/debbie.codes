<script setup lang="ts">
import type { Sections } from '~/types'

const filteredVideos = ref<any[]>([])
const isSearchActive = ref(false)

// Fetch all videos
const { data: allVideos } = await useAsyncData('all-videos-for-pages', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
  .all())

// Get unique tags with counts
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

const title: string = 'Videos'
const description: string = 'Conference talks, interviews, and live streams on Playwright, testing, and AI agents.'
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
    <section v-if="videoTags.length > 0" class="animated-section mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="tag in videoTags"
          :key="tag"
          :to="`/videos/tags/${tag}`"
          :label="tag.replace('-', ' ')"
          hash
        />
      </div>
    </section>

    <!-- Videos Grid Section -->
    <section class="animated-section mb-16">
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
