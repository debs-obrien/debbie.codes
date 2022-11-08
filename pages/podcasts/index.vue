<script setup>
const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find();

const title = `Podcast Interviews`;
const description = `Here's a list of all my podcast interviews`;

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
    <TagsPodCast />
    <CardsList :list="podcasts" />
    <div
      class="mt-12 grid gap-8 mx-auto grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 md:max-w-none"
    >
      <div
        v-for="podcast of podcasts"
        :key="podcast.slug"
        data-test-id="podcasts"
      >
        <PodCastCard :item="podcast" />
      </div>
    </div>
  </div>
</template>
