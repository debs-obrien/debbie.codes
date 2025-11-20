<script setup lang="ts">
import type { Sections } from '~/types'

defineProps<{
  items: any[]
  section: Sections
}>()
</script>

<template>
  <div class="space-y-6 max-w-4xl mx-auto">
    <article
      v-for="item in items"
      :key="item.path"
      class="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-2xl"
    >
      <NuxtLink
        :to="item.path"
        class="block text-2xl font-semibold text-gray-800 hover:underline dark:text-white"
      >
        {{ item.title }}
      </NuxtLink>

      <time v-if="item.date" class="text-sm text-gray-400 dark:text-gray-500 mt-1 block">
        {{ new Date(item.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) }}
      </time>

      <p class="mt-3 text-gray-500 dark:text-gray-300">
        {{ item.description }}
      </p>

      <TagsList :tags="item.tags" section="blog" class="mt-4" />
    </article>
  </div>
</template>
