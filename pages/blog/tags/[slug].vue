<script setup>
const {
  params: { slug }
} = useRoute();

const getArticles = await queryContent('blog')
  .where({ published: { $ne: false }, tags: { $contains: slug } })
  .sort({ date: -1 })
  .find();

const title = `Blog Posts tagged with${slug}`;
const description = `Here's a list of all my blog posts with the ${slug} tag`;

useHead({
  title: title,
  meta: [{ name: 'description', content: description }]
});
</script>

<template>
  <main>
    <AppTitle>{{ title }}</AppTitle>
    <AppIntro>{{ description }}</AppIntro>

    <CardsList :list="getArticles" />
  </main>
</template>
