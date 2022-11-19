<script setup lang="ts">
import type { Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const videos: Array<any> = await queryContent('videos')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const title = `Videos: ${slug}`
const description = 'Videos from conference talks, interviews and live streams'
const section: Sections = 'videos'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <main>
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>{{ description }}</AppIntro>
    <Tags :section="section" />
    <VideoList v-if="videos.length" :list="videos" />
    <TagsNotFound v-else />
  </main>
</template>
