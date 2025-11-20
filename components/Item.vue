<script setup lang="ts">
import type { BlogPostPreview, CoursePreview, PodcastPreview, Sections } from '~/types'
import { calculateReadingTime, formatReadingTime } from '~/utils/reading-time'

defineProps<{
  item: BlogPostPreview | CoursePreview | PodcastPreview
  section: Sections
  showImages?: boolean
}>()
</script>

<template>
  <article class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)] py-4">
    <div v-if="showImages !== false" class="h-full w-full object-cover">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <NuxtImg
          :provider="item.provider"
          :src="item.image"
          :alt="item.title"
          width="272"
          height="272"
          fit="thumb"
          format="webp"
          class="scale-90 transition-all duration-400 hover:scale-100 rounded"
        />
      </NuxtLink>
    </div>

    <div :class="{ 'col-span-4': showImages === false, 'col-span-3': showImages !== false }">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h2
          class="mb-0 lg:mb-4 text-lg md:text-3xl font-semibold text-gray-800 hover:underline dark:text-white"
        >
          {{ item.title }}
        </h2>
        <p
          class="mt-0 lg:mt-3 mb-3 text-base lg:text-base text-gray-500 dark:text-gray-300 md:text-sm overflow-hidden md:overflow-visible whitespace-nowrap md:whitespace-normal text-ellipsis"
        >
          {{ item.description }}
        </p>

        <div v-if="section === 'blog' && ((item as any).body || (item as any).content)" class="text-sm text-gray-500 dark:text-gray-400 mb-2">
          {{ formatReadingTime(calculateReadingTime(String((item as any).body || (item as any).content || ''))) }}
        </div>
      </NuxtLink>
      <TagsList v-if="item.tags" :tags="item.tags" :section="section" />
    </div>
  </article>
</template>
