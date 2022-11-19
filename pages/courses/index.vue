<script setup lang="ts">
import type { Sections } from '~/types'

const courses: Array<any> = await queryContent('courses')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Courses'
const description = 'Collection of courses I have created'
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
    <ItemList :list="courses" :section="section" />
  </main>
</template>
