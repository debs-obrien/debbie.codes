<script setup>
const {
  params: { slug }
} = useRoute();

const interviews = await queryContent('interviews')
  .where({ published: { $ne: false }, tags: { $in: slug } })
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
  </div>
</template>
