<script setup lang="ts">
import type { BlogPostPreview, PodcastPreview, Sections } from '~/types'
defineProps<{
  item: BlogPostPreview | PodcastPreview
  section: Sections
}>()
</script>

<template>
  <article class="container bg-white shadow-2xl rounded-2xl p-5">
    <div>
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

