<script setup>
const {
  params: { slug },
} = useRoute()

const videos = await queryContent('videos')
  .where({ published: { $ne: false }, tags: { $in: slug } })
  .sort({ date: -1 })
  .find()

const title = `Videos: ${slug}`
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
    <VideoList v-if="videos.length" :list="videos" />
    <TagsNotFound v-else />
  </main>
</template>
