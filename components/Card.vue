<script setup lang="ts">
import type { BlogPost, Course, Podcast, Sections } from '~/types'

defineProps<{
  item: BlogPost | Podcast | Course
  section: Sections
}>()
</script>

<template>
  <div class="grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)]">
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
          class="mb-4 text-xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
        >
          {{ item.title }}
        </h2>
        <p
          class="mt-3 text-lg text-gray-500 dark:text-gray-300 md:text-sm"
        >
          {{ item.description }}
        </p>
      </NuxtLink>
      <TagsList v-if="item.tags" :tags="item.tags" :section="section" />
    </div>
  </div>
</template>
