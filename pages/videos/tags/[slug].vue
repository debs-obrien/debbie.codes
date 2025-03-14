<script setup lang="ts">
import type { Sections, Video } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: videos } = await useAsyncData(`videos-${slug}`,
  () => queryCollection('videos')
    .where('tags', 'LIKE', `%${slug}%`)
    .order('date', 'DESC')
    .all(),
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
