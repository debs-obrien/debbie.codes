<script setup lang="ts">
import type { Podcast } from '~/types'
defineProps<{
  item: Podcast
}>()
</script>

<template>
  <section class="text-gray-600 body-font flex flex-col overflow-hidden flex-1 max-width h-full">
    <div
      class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"
    >
      <a :href="item.url" class="block" rel="nofollow" target="_blank">
        <NuxtImg
          :provider="item.provider"
          :src="item.image"
          :alt="item.title"
          width="444"
          height="256"
          format="webp"
          lazy="loading"
          sizes="sm:355px md:320px lg:480px"
          class="lg:h-48 md:h-36 w-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
        />
      </a>

      <div class="p-6">
        <a :href="item.url" class="block">
          <p
            class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
          >
            {{ formatDate(item.date) }}
          </p>
          <h3 class="title-font text-lg font-medium text-gray-600 mb-3">
            {{ item.title }}
          </h3>
        </a>

        <TagsList :tags="item.tags" section="podcasts" />
      </div>
    </div>
  </section>
</template>
