<script setup>
const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'Podcast Interviews'
const description = 'Here\'s a list of all my podcast interviews'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <div class="page-wrapper">
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <Tags section="podcasts" />
    <CardsList :list="podcasts" section="podcasts" />
  </div>
</template>
