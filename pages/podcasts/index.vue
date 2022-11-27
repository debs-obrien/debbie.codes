<script setup lang="ts">
import type { Podcast, Sections } from '~/types'

const { data: podcasts } = await useAsyncData(
  () => queryContent<Podcast>('podcasts')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find(),
)

const title: string = 'Podcast Interviews'
const description: string = 'Here\'s a list of all my podcast interviews'
const section: Sections = 'podcasts'

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
    <ItemList v-if="podcasts !== null" :list="podcasts" :section="section" />
  </main>
</template>
