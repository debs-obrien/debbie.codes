<script setup lang="ts">
import type { Sections } from '~/types'

// Fetch featured videos (conditional)
const { data: featuredVideos } = await useAsyncData('featured-videos', () => queryCollection('videos')
  .where('featured', '=', 'true')
  .order('date', 'DESC')
  .limit(8)
  .all())

// Fetch recent videos
const { data: recentVideos } = await useAsyncData('recent-videos', () => queryCollection('videos')
  .order('date', 'DESC')
  .limit(8)
  .all())

// Fetch conference videos (conditional)
const { data: conferenceVideos } = await useAsyncData('conference-videos', () => queryCollection('videos')
  .where('tags', 'LIKE', '%conference%')
  .order('date', 'DESC')
  .limit(8)
  .all())

// Fetch live stream videos (conditional)
const { data: liveStreamVideos } = await useAsyncData('livestream-videos', () => queryCollection('videos')
  .where('tags', 'LIKE', '%live-streams%')
  .order('date', 'DESC')
  .limit(8)
  .all())

const title: string = 'Videos'
const description: string = 'Videos from conference talks, interviews and live streams'
const section: Sections = 'videos'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Browse by Topic Section -->
    <section class="mb-12 max-w-4xl mx-auto">
      <div class="text-center mb-6">
        <NuxtLink
          v-for="(tag, index) in ['nuxt', 'playwright', 'testing', 'vue', 'javascript', 'react', 'performance', 'accessibility']"
          :key="tag"
          :to="`/videos/tags/${tag}`"
          :class="[
            'hover:opacity-70 transition-opacity mx-2',
            ['text-blue-500', 'text-green-500', 'text-purple-500', 'text-orange-500', 'text-pink-500', 'text-cyan-500'][index % 6]
          ]"
        >
          #{{ tag.replace('-', ' ') }}
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Videos Section -->
    <section v-if="featuredVideos && featuredVideos.length > 0" class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Featured Videos
      </h2>
      <VideoList :list="featuredVideos" />
    </section>

    <!-- Recent Videos Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 mb-6">
        Recent Videos
      </h2>
      <VideoList v-if="recentVideos" :list="recentVideos" />
      <div class="text-center mt-6">
        <NuxtLink
          to="/videos/all"
          class="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
        >
          View All Videos
        </NuxtLink>
      </div>
    </section>

    <!-- Conference Talks Section -->
    <section v-if="conferenceVideos && conferenceVideos.length > 0" class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Conference Talks
        </h2>
        <NuxtLink
          to="/videos/tags/conference-talk"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all →
        </NuxtLink>
      </div>
      <VideoList :list="conferenceVideos" />
    </section>

    <!-- Live Streams Section -->
    <section v-if="liveStreamVideos && liveStreamVideos.length > 0" class="mb-16">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold text-gray-900">
          Live Streams
        </h2>
        <NuxtLink
          to="/videos/tags/live-streams"
          class="text-blue-600 hover:text-blue-800 font-medium"
        >
          View all →
        </NuxtLink>
      </div>
      <VideoList :list="liveStreamVideos" />
    </section>
  </PageLayout>
</template>
