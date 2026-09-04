<script setup lang="ts">
import type { Sections, VideoPreview } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: videosRaw } = await useAsyncData(`videos-${slug}`, () => queryCollection('videos')
  .select(...videoPreviewFields)
  .where('tags', 'LIKE', `%${slug}%`)
  .order('date', 'DESC')
  .all())

const videos = computed(() => filterVisibleVideos(videosRaw.value))

const filteredVideos = ref<VideoPreview[]>([])
const isSearchActive = ref(false)

const { data: allVideosRaw } = await useAsyncData('all-videos-for-tags-page', () => queryCollection('videos')
  .select(...videoPreviewFields)
  .order('date', 'DESC')
  .all())

const allVideos = computed(() => filterVisibleVideos(allVideosRaw.value))

const topic: string = getTagDisplayName(slug as string)
const title: string = `Videos: ${topic}`
const description: string = ''
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
      v-if="(isSearchActive ? filteredVideos : videos)?.length"
      class="animated-section mb-16"
    >
      <h2
        v-if="!isSearchActive"
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto"
      >
        {{ topic }} Videos
      </h2>
      <h2
        v-else
        class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto"
      >
        Search Results ({{ filteredVideos.length }})
      </h2>
      <VideoList :list="(isSearchActive ? filteredVideos : videos) || []" />
    </section>

    <TagsNotFound v-else />

    <div class="animated-section mb-12 max-w-4xl mx-auto">
      <BlogSearch
        :articles="allVideos"
        :default-articles="videos"
        @update:filtered-articles="filteredVideos = $event"
        @search-active="isSearchActive = $event"
      />
    </div>
  </PageLayout>
</template>
