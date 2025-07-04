<script setup lang="ts">
import type { Podcast, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: podcasts } = await useAsyncData(`podcasts-${slug}`,
  () => queryCollection('podcasts')
    .where('tags', 'LIKE', `%${slug}%`)
    .order('date', 'DESC')
    .all(),
)

const topic: string = replaceHyphen(slug as string)
const title: string = `Podcast Interviews on ${topic}`
const description: string = `Here's a list of all my podcast interviews with the ${topic} tag`
const section: Sections = 'podcasts'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <main class="container mx-auto px-4 sm:px-6 max-w-7xl">    <!-- Hero Section -->
    <div class="text-center py-8">
      <h1 class="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-4">
        {{ title }}
      </h1>
      <p class="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-6">
        Discover podcast episodes about {{ topic.toLowerCase() }} and related topics.
      </p>
    </div>

    <!-- Filter Tags -->
    <section class="mb-12">
      <TagsFiltered :section="section" />
    </section>

    <!-- Filtered Episodes Grid -->
    <section v-if="podcasts && podcasts.length > 0" class="mb-16">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-3xl font-bold text-gray-900 dark:text-white">
          {{ topic }} Episodes
        </h2>
        <div class="text-sm text-gray-500">
          {{ podcasts.length }} {{ podcasts.length === 1 ? 'episode' : 'episodes' }}
        </div>
      </div>
      
      <PodcastGrid :list="podcasts" />
    </section>

    <!-- No results found -->
    <section v-else-if="podcasts && podcasts.length === 0" class="text-center py-16">
      <TagsNotFound />
    </section>

    <!-- Call to Action -->
    <section class="bg-blue-50 dark:bg-gray-800 rounded-2xl p-8 text-center mt-16">
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
  </main>
</template>
