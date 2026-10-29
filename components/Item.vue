<script setup lang="ts">
import type { BlogPostPreview, CoursePreview, PodcastPreview, Sections } from '~/types'
import { calculateReadingTime, formatReadingTime } from '~/utils/reading-time'
import { isAllowedNetlifyRemoteSrc } from '~/utils/remote-images'

const props = defineProps<{
  item: BlogPostPreview | CoursePreview | PodcastPreview
  section: Sections
  showImages?: boolean
}>()

/** Local paths use NuxtImg/Netlify CDN; non-allowlisted remotes (e.g. i.ytimg.com) stay plain <img>. */
const useNuxtImg = computed(() => {
  const src = props.item.image || ''
  if (!src)
    return false
  if (src.startsWith('/') || src.startsWith('./'))
    return true
  return isAllowedNetlifyRemoteSrc(src)
})
</script>

<template>
  <article class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)] py-4">
    <div v-if="showImages !== false" class="h-full w-full object-cover">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <NuxtImg
          v-if="useNuxtImg"
          :src="item.image"
          :alt="item.title"
          width="272"
          height="272"
          fit="cover"
          format="webp"
          loading="lazy"
          sizes="272px"
          densities="x1 x2"
          class="scale-90 transition-all duration-400 hover:scale-100 rounded"
        />
        <img
          v-else
          :src="item.image"
          :alt="item.title"
          width="272"
          height="272"
          loading="lazy"
          decoding="async"
          class="scale-90 transition-all duration-400 hover:scale-100 rounded object-cover"
        >
      </NuxtLink>
    </div>

    <div :class="{ 'col-span-4': showImages === false, 'col-span-3': showImages !== false }">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h2
          class="mb-0 lg:mb-4 text-lg md:text-2xl font-semibold text-gray-800 dark:text-white hover:text-primary transition-colors"
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
