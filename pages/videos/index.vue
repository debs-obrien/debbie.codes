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
    <div
      class="mt-12 grid gap-8 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:max-w-none"
    >
      <div v-for="video of videos" :key="video.slug" data-test-id="interviews">
        <VideoCard :item="video" />
      </div>
    </div>
  </main>
</template>
