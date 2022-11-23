<script setup lang="ts">
import type { Podcast, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: podcasts } = await useAsyncData(
  () => queryContent<Podcast>('podcasts')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
)

const topic: string = replaceHyphen(slug as string)
const title = `Podcast Interviews on ${topic}`
const description = `Here's a list of all my podcast interviews with the ${topic} tag`
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
    <TagsNotFound v-else />
  </main>
</template>
