<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: articles } = await useAsyncData(`articles-${slug}`,
  () => queryCollection('blog')
    .where('tags', 'LIKE', `%${slug}%`)
    .order('date', 'DESC')
    .all(),
)

const topic: string = replaceHyphen(slug as string)
const title: string = `Blog Posts on ${topic}`
const description: string = `Here's a list of all my blog posts with the ${topic} tag`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <ItemList v-if="articles !== null" :list="articles" :section="section" />
    <TagsNotFound v-else />
  </PageLayout>
</template>
