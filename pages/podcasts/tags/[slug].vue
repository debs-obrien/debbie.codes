<script setup lang="ts">
import type { Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: podcasts } = await useAsyncData(`podcasts-${slug}`, () => queryCollection('podcasts')
  .where('tags', 'LIKE', `%${slug}%`)
  .order('date', 'DESC')
  .all())

const filteredPodcasts = ref<any[]>([])
const isSearchActive = ref(false)

// Get all podcasts to extract real tags
const { data: allPodcasts } = await useAsyncData('all-podcasts-for-tags-page', () => queryCollection('podcasts')
  .all())

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

const topic: string = replaceHyphen(slug as string)
const title: string = `Podcasts: ${topic}`
const description: string = ''
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
    <section v-if="podcastTags.length > 0" class="mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <NuxtLink
          v-for="(tag, index) in podcastTags"
          :key="tag"
          :to="`/podcasts/tags/${tag}`"
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

    <!-- Filtered Episodes Grid -->
    <section v-if="(isSearchActive ? filteredPodcasts : podcasts)?.length" class="mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        {{ topic }} Episodes
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredPodcasts.length }})
      </h2>
      <PodcastGrid :list="(isSearchActive ? filteredPodcasts : podcasts) || []" />
    </section>

    <!-- No results found -->
    <section v-else-if="podcasts && podcasts.length === 0" class="text-center py-16">
      <TagsNotFound />
    </section>

    <!-- Call to Action -->
    <section class="bg-blue-50 dark:bg-gray-800 rounded-2xl p-8 text-center max-w-4xl mx-auto">
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
        class="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
      >
        Get in touch
      </a>
    </section>
  </PageLayout>
</template>
