<script setup lang="ts">
import type { Sections } from '~/types'

const videosPerPage = 24
const filteredVideos = ref<any[]>([])
const isSearchActive = ref(false)

const { data: pageVideos } = await useAsyncData('videos-page-1', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
  .limit(videosPerPage)
  .all())

const { data: totalCount } = await useAsyncData('videos-total-count', () => queryCollection('videos')
  .count())

const { data: allVideos } = await useAsyncData('all-videos-for-pages', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
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

  // Keep every topic on the chip row so older tags stay reachable after pagination.
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
})

const totalPages = computed(() => {
  if (!totalCount.value)
    return 1
  return Math.ceil(totalCount.value / videosPerPage)
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
    <BlogSearch
      :articles="allVideos || []"
      :default-articles="pageVideos || []"
      @update:filtered-articles="filteredVideos = $event"
      @search-active="isSearchActive = $event"
    />

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

    <section class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Recent Videos
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredVideos.length }})
      </h2>
      <VideoList :list="isSearchActive ? filteredVideos : (pageVideos || [])" />
      <Pagination
        v-if="!isSearchActive && totalPages > 1"
        :current-page="1"
        :total-pages="totalPages"
        base-url="/videos"
      />
    </section>
  </PageLayout>
</template>
