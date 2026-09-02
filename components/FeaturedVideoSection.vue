<script setup lang="ts">
import type { VideoPreview } from '~/types'

const props = defineProps<{
  list: Array<VideoPreview>
}>()

const getYouTubeUrl = (videoId: string) => `https://www.youtube.com/watch?v=${videoId}`

const mainVideo = computed(() => props.list[0])
const otherVideos = computed(() => props.list.slice(1))
</script>

<template>
  <div class="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
    <!-- Main Featured Video -->
    <div class="group">
      <NuxtLink :to="getYouTubeUrl(mainVideo.video)" target="_blank" rel="noopener noreferrer">
        <div class="aspect-video rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
          <img
            :src="youtubeThumbnail(mainVideo.video)"
            :alt="mainVideo.title"
            width="1280"
            height="720"
            fetchpriority="high"
            class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          >
        </div>
        <h3 class="mt-4 text-xl font-bold text-gray-800 dark:text-white group-hover:text-primary transition-colors">
          {{ mainVideo.title }}
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ mainVideo.host }}
        </p>
      </NuxtLink>
    </div>

    <!-- Other Videos List -->
    <div class="space-y-6">
      <div
        v-for="video of otherVideos"
        :key="video.video"
        class="group"
      >
        <NuxtLink :to="getYouTubeUrl(video.video)" target="_blank" rel="noopener noreferrer" class="flex items-start gap-4">
          <div class="flex-shrink-0">
            <img
              :src="youtubeThumbnail(video.video)"
              :alt="video.title"
              width="128"
              height="72"
              loading="lazy"
              decoding="async"
              class="rounded-lg object-cover border border-gray-200 dark:border-gray-700"
            >
          </div>
          <div>
            <h4 class="font-semibold text-gray-800 dark:text-white group-hover:text-primary transition-colors">
              {{ video.title }}
            </h4>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              {{ video.host }}
            </p>
          </div>
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
