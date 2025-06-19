<script setup lang="ts">
import type { BlogPostPreview, Sections } from '~/types'

defineProps<{
  items: BlogPostPreview[]
  section: Sections
}>()
</script>

<template>
  <div class="grid md:grid-cols-2 gap-6">
    <article
      v-for="item in items"
      :key="item.path"
      class="bg-white dark:bg-gray-900 container mx-auto my-5 p-5 rounded-2xl shadow-2xl"
    >
      <div class="lg:mx-6">
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
  </div>
</template>
