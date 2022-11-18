<script setup>
const videos = await queryContent('videos')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Videos'
const description = 'Videos from conference talks, interviews and live streams'
const section = 'videos'
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
    <VideoList :list="videos" />
  </main>
</template>
