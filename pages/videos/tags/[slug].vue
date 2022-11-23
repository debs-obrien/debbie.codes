<script setup lang="ts">
import type { Sections, Video } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: videos } = await useAsyncData(
  () => queryContent<Video>('videos')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
)

const topic: string = formatTopic(slug as string)
const title = `Videos: ${topic}`
const description = `Videos with the ${topic} tag`
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
    <VideoList v-if="videos !== null" :list="videos" />
    <TagsNotFound v-else />
  </main>
</template>
