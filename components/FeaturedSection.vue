<script setup lang="ts">
import type { BlogPostPreview, Sections } from '~/types'

defineProps<{
  item: BlogPostPreview
  section: Sections
}>()
</script>

<template>
  <article class="bg-white dark:bg-gray-900 container mx-auto my-5 p-5 lg:-mx-6 lg:flex lg:items-center">
    <NuxtLink :to="item.path" :aria-label="item.title">
      <NuxtImg
        :provider="item.provider"
        :src="item.image"
        :alt="item.title"
        width="680"
        height="280"
        fit="fill"
        format="webp"
        class="scale-90 transition-all duration-400 hover:scale-100 rounded"
      />
    </NuxtLink>

    <div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">
      <TagsList :tags="item.tags" section="blog" />

      <NuxtLink
        :to="item.path"
        class="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
      >
        {{ item.title }}
      </NuxtLink>

      <p class="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
        {{ item.description }}
      </p>

      <NuxtLink
        :to="item.path"
        :aria-label="`read more about ${item.title}`"
        class="inline-block mt-2 text-blue-600 dark:text-blue-500 underline hover:text-blue-400"
      >
        Read more
      </NuxtLink>
    </div>
  </article>
</template>
