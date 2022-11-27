<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

const { data: articles } = await useAsyncData(
  () => queryContent<BlogPost>('blog')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find(),
)

const title: string = 'All Blog Posts'
const description: string = 'Here\'s a list of all my blog posts'
const section: Sections = 'blog'

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
    <ItemList v-if="articles !== null" :list="articles" :section="section" />
  </main>
</template>
