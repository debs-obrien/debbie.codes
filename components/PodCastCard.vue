<script setup lang="ts">
import type { Podcast } from '~/types'
defineProps<{
  item: Podcast
}>()
</script>

<template>
  <div class="flex flex-col overflow-hidden flex-1 max-width h-full">
    <section class="text-gray-600 body-font">
      <div
        class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"
      >
        <a :href="item.url" class="block" rel="nofollow" target="_blank">
          <NuxtImg
            :provider="item.provider"
            :src="item.image"
            :alt="item.title"
            preset="blog"
            width="444"
            height="256"
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
            <h4 class="title-font text-lg font-medium text-gray-600 mb-3">
              {{ item.title }}
            </h4>
          </a>

          <ul v-for="tag in item.tags" :key="tag" class="inline-block">
            <li class="text-sm text-blue-500 uppercase flex pr-4">
              {{ tag }}
            </li>
          </ul>
        </div>
      </div>
    </section>
  </div>
</template>
