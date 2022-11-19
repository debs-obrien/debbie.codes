<script setup>
const {
  params: { slug },
} = useRoute()

const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find()

const title = `Podcast Interviews on ${slug}`
const description = `Here's a list of all my podcast interviews with the ${slug} tag`
const section = 'podcasts'

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
    <CardList v-if="podcasts.length" :list="podcasts" :section="section" />
    <TagsNotFound v-else />
  </main>
</template>
