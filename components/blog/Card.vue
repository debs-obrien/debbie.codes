<script setup lang="ts">
import type { BlogPost } from '~/types'
defineProps<{
  item: BlogPost
}>()
</script>

<template>
  <section class="text-gray-600 body-font flex flex-col overflow-hidden flex-1 max-width h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden">
    <NuxtLink
      :to="item.url || item._path"
      :target="item.url ? '_blank' : '_self'"
      class="block"
    >
      <NuxtImg
        :provider="item.provider"
        :src="item.image"
        :alt="item.title"
        width="600"
        height="340"
        fit="cover"
        lazy="loading"
        class="aspect-video w-full h-full object-cover object-center scale-110 transition-all duration-400 hover:scale-100"
        format="webp"
      />
    </NuxtLink>

    <div class="p-6">
      <NuxtLink
        :to="item.url || item._path"
        :target="item.url ? '_blank' : '_self'"
        class="block"
      >
        <p
          class="tracking-widest text-xs title-font font-medium text-gray-400 mb-1"
        >
          {{ formatDate(item.date) }}
        </p>
        <h3 class="title-font text-lg font-medium text-gray-600 mb-3">
          {{ item.title }}
        </h3>
      </NuxtLink>
      <TagsList :tags="item.tags" section="blog" />
    </div>
  </section>
</template>
