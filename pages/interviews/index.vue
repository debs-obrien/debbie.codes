<script setup>
const interviews = await queryContent('interviews')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find();

const title = `Guest Interviews`;
const description = `Recordings of various interviews on different channels`;

useHead({
  title: title,
  meta: [{ name: 'description', content: description }]
});
</script>

<template>
  <div class="page-wrapper">
    <AppBreadCrumb title="podcasts" />
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>
      {{ description }}
    </AppIntro>
    <Tags page="interviews" />
    <CardsList :list="interviews" :section="interviews" />
    <div
      class="mt-12 grid gap-8 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:max-w-none"
    >
      <div v-for="video of videos" :key="video.slug" data-test-id="interviews">
        <VideoCard :item="video" />
      </div>
    </div>
  </div>
</template>
