<script setup lang="ts">
import type { Sections } from '~/types'

const { data: articles } = await useAsyncData('articles',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
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
