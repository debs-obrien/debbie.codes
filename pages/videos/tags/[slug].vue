<script setup lang="ts">
import type { Sections, Video } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: videos } = await useAsyncData(`videos-${slug}`,
  () => queryCollection<Video>('videos')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
)

const topic: string = replaceHyphen(slug as string)
const title: string = `Videos: ${topic}`
const description: string = `Videos with the ${topic} tag`
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
