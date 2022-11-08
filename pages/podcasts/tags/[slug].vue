<script setup>
const {
  params: { slug }
} = useRoute();

const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false }, tags: { $in: slug } })
  .sort({ date: -1 })
  .find();

const title = `Podcast Interviews on ${slug}`;
const description = `Here's a list of all my podcast interviews with the ${slug} tag`;

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
  </div>
</template>
