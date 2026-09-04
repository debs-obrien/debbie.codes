<script setup lang="ts">
import type { Sections, VideoPreview } from '~/types'

const videosPerPage = 24
const filteredVideos = ref<VideoPreview[]>([])
const isSearchActive = ref(false)

const { data: allVideosRaw } = await useAsyncData('all-videos-for-pages', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
  .all())

const allVideos = computed(() => filterVisibleVideos(allVideosRaw.value))

const featuredVideos = computed(() => {
  return allVideos.value
    .filter(video => video.featured)
    .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99))
    .slice(0, 3)
})

const featuredVideoIds = computed(() => new Set(featuredVideos.value.map(video => video.video)))

const latestPool = computed(() => {
  return allVideos.value.filter(video => !featuredVideoIds.value.has(video.video))
})

const pageVideos = computed(() => latestPool.value.slice(0, videosPerPage))

const totalPages = computed(() => {
  if (!latestPool.value.length)
    return 1
  return Math.ceil(latestPool.value.length / videosPerPage)
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
    <VideosFeaturedSection :list="featuredVideos" />

    <VideosFilterChips />

    <section
      class="animated-section mb-16"
      aria-labelledby="latest-videos-heading"
    >
      <h2
        v-if="!isSearchActive"
        id="latest-videos-heading"
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto"
      >
        Latest
      </h2>
      <h2
        v-else
        id="latest-videos-heading"
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto"
      >
        Search Results ({{ filteredVideos.length }})
      </h2>
      <VideoList :list="isSearchActive ? filteredVideos : pageVideos" />
      <Pagination
        v-if="!isSearchActive && totalPages > 1"
        :current-page="1"
        :total-pages="totalPages"
        base-url="/videos"
      />
    </section>

    <div class="animated-section mb-12 max-w-4xl mx-auto">
      <BlogSearch
        :articles="allVideos"
        :default-articles="pageVideos"
        @update:filtered-articles="filteredVideos = $event"
        @search-active="isSearchActive = $event"
      />
    </div>
  </PageLayout>
</template>
