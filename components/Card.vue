<script setup lang="ts">
import type { BlogPostPreview, PodcastPreview, Sections } from '~/types'
import { calculateReadingTime, formatReadingTime } from '~/utils/reading-time'

defineProps<{
  item: BlogPostPreview | PodcastPreview
  section: Sections
}>()
</script>

<template>
  <article
    class="container bg-white shadow-2xl rounded-2xl p-5 h-full"
    :class="{
      'grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]':
        section === 'podcasts',
    }"
  >
    <div v-if="section === 'podcasts'" class="h-full w-full object-cover">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <NuxtImg
          :provider="item.provider || 'cloudinary'"
          :src="item.image"
          :alt="item.title"
          width="272"
          height="272"
          fit="thumb"
          format="webp"
          loading="lazy"
          class="scale-90 transition-all duration-400 hover:scale-100 rounded"
        />
      </NuxtLink>
    </div>
    <div :class="{ 'col-span-2': section === 'podcasts' }">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h3 class="title-font text-lg font-medium text-gray-600 mb-2 leading-tight">
          {{ item.title }}
        </h3>

        <div class="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-2">
          <Date :date="item.date" />
          <span v-if="section === 'blog' && ((item as any).body || (item as any).content)" class="ml-2">
            {{ formatReadingTime(calculateReadingTime(String((item as any).body || (item as any).content || ''))) }}
          </span>
        </div>
      </NuxtLink>
      <TagsList :tags="item.tags" :section="section" />
    </div>
  </article>
</template>

