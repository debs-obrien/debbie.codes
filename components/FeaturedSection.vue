<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

defineProps<{
  item: any
  section: Sections
}>()
</script>

<template>
  <section class="bg-white dark:bg-gray-900 container py-10 mx-auto mt-8 lg:-mx-6 lg:flex lg:items-center">
    <NuxtLink :to="item._path" :aria-label="item.title">
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
        :to="item._path"
        class="block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
      >
        {{ item.title }}
      </NuxtLink>

      <p class="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">
        {{ item.description }}
      </p>

      <NuxtLink
        :to="item._path"
        :aria-label="item.title"
        class="inline-block mt-2 text-blue-600 dark:text-blue-500 underline hover:text-blue-400"
      >
        Read more
      </NuxtLink>
    </div>
  </section>
</template>
