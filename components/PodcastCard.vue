<script setup lang="ts">
import type { PodcastPreview } from '~/types'

defineProps<{
  item: PodcastPreview
}>()
</script>

<template>
  <article class="bg-white dark:bg-gray-900 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
    <!-- Podcast Cover Image -->
    <div class="aspect-square relative overflow-hidden">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
        class="block"
      >
        <NuxtImg
          :provider="item.provider || 'cloudinary'"
          :src="item.image"
          :alt="item.title"
          width="400"
          height="400"
          fit="cover"
          format="webp"
          loading="lazy"
          class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <!-- Overlay with play icon -->
        <div class="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <svg class="w-8 h-8 text-gray-800 ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </NuxtLink>
    </div>

    <!-- Content -->
    <div class="p-6">
      <div class="mb-3">
        <span class="text-sm font-medium text-blue-600 dark:text-blue-400">
          {{ item.host }}
        </span>
      </div>

      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-2">
        <NuxtLink
          :to="item.url || item.path"
          :target="item.url ? '_blank' : '_self'"
          class="hover:no-underline"
        >
          {{ item.title }}
        </NuxtLink>
      </h2>

      <p class="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-3">
        {{ item.description }}
      </p>

      <div class="flex items-center justify-between">
        <Date :date="item.date" class="text-xs text-gray-500" />
        <TagsList :tags="item.tags.slice(0, 2)" section="podcasts" class="flex-1 ml-3" />
      </div>
    </div>
  </article>
</template>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
