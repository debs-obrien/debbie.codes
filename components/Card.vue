<script setup lang="ts">
import type { BlogPost, Podcast, Sections } from '~/types'
defineProps<{
  item: BlogPost | Podcast
  section: Sections
}>()
</script>

<template>
  <article class="container bg-white shadow-2xl rounded-2xl p-5 grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]">
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
          loading="lazy"
          class="scale-90 transition-all duration-400 hover:scale-100 rounded"
        />
      </NuxtLink>
    </div>
    <div class="col-span-2">
      <NuxtLink
        :to="item.url || item._path"
        :target="item.url ? '_blank' : '_self'"
      >
        <h3 class="title-font text-lg font-medium text-gray-600 mb-3">
          {{ item.title }}
        </h3>
        <p
          class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
        >
          {{ formatDate(item.date) }}
        </p>
      </NuxtLink>
      <TagsList :tags="item.tags" :section="section" />
    </div>
  </article>
</template>

