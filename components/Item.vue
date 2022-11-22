<script setup lang="ts">
import type { BlogPost, Course, Podcast, Sections } from '~/types'

defineProps<{
  item: BlogPost | Podcast | Course
  section: Sections
}>()
</script>

<template>
  <article class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)] py-4 border-b">
    <div class="h-full w-full object-cover">
      <NuxtLink
        :to="item.url || item._path"
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

    <div class="col-span-3">
      <NuxtLink
        :to="item.url || item._path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h2
          class="mb-0 lg:mb-4 text-lg md:text-3xl font-semibold text-gray-800 hover:underline dark:text-white"
        >
          {{ item.title }}
        </h2>
        <p
          class="mt-0 lg:mt-3 text-base lg:text-lg text-gray-500 dark:text-gray-300 md:text-sm overflow-hidden md:overflow-visible whitespace-nowrap md:whitespace-normal text-ellipsis"
        >
          {{ item.description }}
        </p>
      </NuxtLink>
      <TagsList v-if="item.tags" :tags="item.tags" :section="section" />
    </div>
  </article>
</template>
