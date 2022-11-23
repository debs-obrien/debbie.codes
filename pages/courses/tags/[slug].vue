<script setup lang="ts">
import type { Course, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: courses } = await useAsyncData(
  () => queryContent<Course>('courses')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
)

const topic: string = formatTopic(slug as string)
const title = `Courses on ${topic}`
const description = `Here's a list of all my courses with the ${topic} tag`
const section: Sections = 'courses'

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
    <ItemList v-if="courses !== null" :list="courses" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>
