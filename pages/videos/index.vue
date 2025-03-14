<script setup lang="ts">
import type { Sections, Video } from '~/types'

const { data: videos } = await useAsyncData('videos',
  () => queryCollection('videos')
    .order('date', 'DESC')
    .all(),
)

const title: string = 'Videos'
const description: string = 'Videos from conference talks, interviews and live streams'
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
  </main>
</template>
