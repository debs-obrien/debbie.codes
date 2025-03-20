<script setup lang="ts">
import type { Course, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: courses } = await useAsyncData(`courses-${slug}`,
  () => queryCollection('courses')
    .where('tags', 'LIKE', `%${slug}%`)
    .order('date', 'DESC')
    .all(),
)

const topic: string = replaceHyphen(slug as string)
const title: string = `Courses on ${topic}`
const description: string = `Here's a list of all my courses with the ${topic} tag`
const section: Sections = 'courses'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <ItemList v-if="courses !== null" :list="courses" :section="section" />
    <TagsNotFound v-else />
  </PageLayout>
</template>
