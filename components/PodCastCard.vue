<script setup lang="ts">
import type { Podcast } from '~/types'
defineProps<{
  item: Podcast
}>()
</script>

<template>
  <article class="container bg-white shadow-2xl rounded-2xl p-5 grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]">
    <div class="h-full w-full object-cover">
      <a :href="item.url" class="block" rel="nofollow" target="_blank">
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
      </a>
    </div>
    <div class="col-span-2">
      <a :href="item.url" class="block">
        <h3 class="title-font text-lg font-medium text-gray-600 mb-3">
          {{ item.title }}
        </h3>
        <p
          class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
        >
          {{ formatDate(item.date) }}
        </p>
      </a>
    </div>
  </article>
</template>

