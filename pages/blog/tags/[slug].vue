<script setup lang="ts">
import type { Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const articles: Array<any> = await queryContent('blog')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const topic: string = slug.replace('-', ' ')

const title = `Blog Posts on ${topic}`
const description = `Here's a list of all my blog posts with the ${topic} tag`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <main>
    <AppTitle class="capitalize">
      {{ title }}
    </AppTitle>
    <AppIntro>{{ description }}</AppIntro>
    <Tags :section="section" />
    <ItemList v-if="articles.length" :list="articles" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>
