<script setup lang="ts">
import type { Sections, VideoPreview } from '~/types'

const route = useRoute()
const page = Number.parseInt(route.params.number as string) || 1
const videosPerPage = 24
const offset = (page - 1) * videosPerPage

const filteredVideos = ref<VideoPreview[]>([])
const isSearchActive = ref(false)

const { data: allVideosRaw } = await useAsyncData('all-videos-for-pages', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
  .all())

const allVideos = computed(() => filterVisibleVideos(allVideosRaw.value))

const featuredVideoIds = computed(() => {
  return new Set(
    allVideos.value
      .filter(video => video.featured)
      .map(video => video.video),
  )
})

const latestPool = computed(() => {
  return allVideos.value.filter(video => !featuredVideoIds.value.has(video.video))
})

const pageVideos = computed(() => latestPool.value.slice(offset, offset + videosPerPage))

const totalPages = computed(() => {
  if (!latestPool.value.length)
    return 1
  return Math.ceil(latestPool.value.length / videosPerPage)
})

if (page < 1 || (latestPool.value.length && page > totalPages.value)) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const title: string = page === 1 ? 'Videos' : `Videos - Page ${page}`
const description: string = 'Conference talks, interviews, and live streams on Playwright, testing, and AI agents.'
const section: Sections = 'videos'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
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
        :current-page="page"
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
