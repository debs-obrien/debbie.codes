<script setup lang="ts">
import type { Course, Sections } from '~/types'

const { data: courses } = await useAsyncData('courses',
  () => queryCollection('courses')
    .order('date', 'DESC')
    .all(),
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
  <PageLayout :title="title" :description="description" :section="section">
    <ItemList v-if="courses !== null" :list="courses" :section="section" />
  </PageLayout>
</template>
