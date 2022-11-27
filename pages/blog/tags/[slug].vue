<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: articles } = await useAsyncData('articles',
  () => queryContent<BlogPost>('blog')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
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
  <main>
    <header>
      <AppTitle>
        {{ title }}
      </AppTitle>
      <AppIntro>{{ description }}</AppIntro>
      <Tags :section="section" />
    </header>
    <ItemList v-if="articles !== null" :list="articles" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>
