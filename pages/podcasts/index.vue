<script setup lang="ts">
import type { Podcast, Sections } from '~/types'

const { data: podcasts } = await useAsyncData('podcasts',
  () => queryCollection('podcasts')
    .order('date', 'DESC')
    .all(),
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
  <PageLayout :title="title" :description="description" :section="section">
    <ItemList v-if="podcasts !== null" :list="podcasts" :section="section" />
  </PageLayout>
</template>
