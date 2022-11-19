<script setup>
const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Podcast Interviews'
const description = 'Here\'s a list of all my podcast interviews'
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
    <CardList :list="podcasts" :section="section" />
  </main>
</template>
