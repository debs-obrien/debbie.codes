<script setup lang="ts">
import type { Course, Sections } from '~/types'

const { data: courses } = await useAsyncData(
  () => queryContent<Course>('courses')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find(),
)

const title: string = 'Courses'
const description: string = 'Collection of courses I have created'
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
  </main>
</template>
