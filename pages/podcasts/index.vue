<script setup lang="ts">
import type { Sections } from '~/types'

const filteredPodcasts = ref<any[]>([])
const isSearchActive = ref(false)

const { data: allPodcasts } = await useAsyncData('podcasts', () => queryCollection('podcasts').select(...podcastPreviewFields).order('date', 'DESC').all())

// Filter out featured podcasts from the main list (podcasts with featured: true)
const podcasts = computed(() => {
  if (!allPodcasts.value) return []
  return allPodcasts.value.filter(podcast => !podcast.featured)
})

// Get all podcasts to extract real tags
const podcastTags = computed(() => {
  if (!allPodcasts.value)
    return []

  const tagCounts = new Map<string, number>()

  allPodcasts.value.forEach((podcast: any) => {
    if (podcast.tags) {
      podcast.tags.forEach((tag: string) => {
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

const title: string = 'Podcasts'
const description: string = 'Podcast conversations on Playwright, testing, AI agents, and developer advocacy.'
const section: Sections = 'podcasts'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Bar -->
    <BlogSearch
      :articles="allPodcasts || []"
      :default-articles="allPodcasts || []"
      @update:filtered-articles="filteredPodcasts = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Tag Section -->
    <section v-if="podcastTags.length > 0" class="animated-section mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="tag in podcastTags"
          :key="tag"
          :to="`/podcasts/tags/${tag}`"
          :label="tag.replace('-', ' ')"
          hash
        />
      </div>
    </section>

    <!-- Featured Podcast Section -->
    <section class="animated-section mb-16">
      <FeaturedPodcast />
    </section>

    <!-- Podcasts Grid Section -->
    <section class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        All Episodes
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredPodcasts.length }})
      </h2>
      <PodcastGrid :list="isSearchActive ? filteredPodcasts : podcasts" />
    </section>

    <!-- Call to Action -->
    <section class="animated-section bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center max-w-4xl mx-auto">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Want to collaborate?
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        I'm always open to interesting podcast conversations about web development, testing, and technology.
      </p>
      <a
        href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center px-6 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary/90 transition-colors"
      >
        Get in touch
      </a>
    </section>
  </PageLayout>
</template>
