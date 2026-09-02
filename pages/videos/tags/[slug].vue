<script setup lang="ts">
import type { Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: videos } = await useAsyncData(`videos-${slug}`, () => queryCollection('videos')
  .select(...videoPreviewFields)
  .where('tags', 'LIKE', `%${slug}%`)
  .order('date', 'DESC')
  .all())

const filteredVideos = ref<any[]>([])
const isSearchActive = ref(false)

// Get all videos to extract real tags
const { data: allVideos } = await useAsyncData('all-videos-for-tags-page', () => queryCollection('videos')
  .select(...videoPreviewFields)
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

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([tag]) => tag)
})

const topic: string = replaceHyphen(slug as string)
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
          :label="replaceHyphen(tag)"
          hash
        />
      </div>
    </section>

    <!-- Videos Grid Section -->
    <section v-if="(isSearchActive ? filteredVideos : videos)?.length" class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        {{ topic }} Videos
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredVideos.length }})
      </h2>
      <VideoList :list="(isSearchActive ? filteredVideos : videos) || []" />
    </section>

    <TagsNotFound v-else />
  </PageLayout>
</template>
