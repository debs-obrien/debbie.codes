<script setup lang="ts">
import type { Sections } from '~/types'

const filteredPodcasts = ref<any[]>([])
const isSearchActive = ref(false)

const { data: allPodcasts } = await useAsyncData('podcasts', () => queryCollection('podcasts').select(...podcastPreviewFields).order('date', 'DESC').all())

// Guest appearances: every podcasts collection entry (featured folded into the grid).
const podcasts = computed(() => allPodcasts.value || [])

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

  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)
})

const title: string = 'Podcasts'
const description: string = 'Coffee with Debbie, my weekly video podcast, plus conversations I\'ve joined on other shows.'
const section: Sections = 'podcasts'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <MyShowCard />

    <!-- Search applies to guest appearances only; My show card stays above. -->
    <BlogSearch
      :articles="allPodcasts || []"
      :default-articles="allPodcasts || []"
      input-aria-label="Search guest appearances"
      @update:filtered-articles="filteredPodcasts = $event"
      @search-active="isSearchActive = $event"
    />

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

    <section class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Guest appearances
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredPodcasts.length }})
      </h2>
      <PodcastGrid :list="isSearchActive ? filteredPodcasts : podcasts" />
    </section>

    <section class="animated-section bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center max-w-4xl mx-auto">
      <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Want me on your podcast?
      </h3>
      <p class="text-gray-600 dark:text-gray-300 mb-6">
        I'm still happy to join other shows for conversations about testing, DevRel and AI.
      </p>
      <a
        href="https://www.linkedin.com/in/debbie-obrien"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex items-center px-6 py-3 bg-primary-fill text-white font-medium rounded-lg hover:bg-primary-fill/90 transition-colors focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#d8002d] dark:focus-visible:outline-[#ff5a73]"
      >
        Get in touch
      </a>
    </section>
  </PageLayout>
</template>
