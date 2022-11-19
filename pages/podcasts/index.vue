<script setup lang="ts">
import type { Sections } from '~/types'

const podcasts: Array<any> = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Podcast Interviews'
const description = 'Here\'s a list of all my podcast interviews'
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
    <ItemList :list="podcasts" :section="section" />
  </main>
</template>
