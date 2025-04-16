<script setup lang="ts">
import type { Podcast, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: podcasts } = await useAsyncData(`podcasts-${slug}`,
  () => queryCollection('podcasts')
    .where('tags', 'LIKE', `%${slug}%`)
    .order('date', 'DESC')
    .all(),
)

const topic: string = replaceHyphen(slug as string)
const title: string = `Podcast Interviews on ${topic}`
const description: string = `Here's a list of all my podcast interviews with the ${topic} tag`
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
    <TagsFiltered :section="section" />
    <ItemList v-if="podcasts !== null" :list="podcasts" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>
