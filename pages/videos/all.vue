<script setup lang="ts">
import type { Sections, Video } from '~/types'

const { data: videos } = await useAsyncData('all-videos',
  () => queryCollection('videos')
    .order('date', 'DESC')
    .all(),
)

const title: string = 'All Videos'
const description: string = 'Complete collection of videos from conference talks, interviews and live streams'
const section: Sections = 'videos'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <VideoList v-if="videos !== null" :list="videos" />
  </PageLayout>
</template>