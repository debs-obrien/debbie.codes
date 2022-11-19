<script setup lang="ts">
import type { Sections } from '~/types'

const articles: Array<any> = await queryContent('blog')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'All Blog Posts'
const description = 'Here\'s a list of all my blog posts'
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
    <ItemList :list="articles" :section="section" />
  </main>
</template>
