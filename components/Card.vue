<script setup lang="ts">
import type { BlogPostPreview, PodcastPreview, Sections } from '~/types'
defineProps<{
  item: BlogPostPreview | PodcastPreview
  section: Sections
}>()
</script>

<template>
  <article class="container bg-white shadow-2xl rounded-2xl p-5 grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]">
    <div class="h-full w-full object-cover">
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
    <div class="col-span-2">
      <NuxtLink
        :to="item.url || item.path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h3 class="title-font text-lg font-medium text-gray-600 mb-2 leading-tight">
          {{ item.title }}
        </h3>

        <Date :date="item.date" />
      </NuxtLink>
      <TagsList :tags="item.tags" :section="section" />
    </div>
  </article>
</template>

