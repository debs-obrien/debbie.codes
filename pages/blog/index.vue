<script setup>
const getArticles = await queryContent('blog')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .find()

const title = 'All Blog Posts'
const description = 'Here\'s a list of all my blog posts'
const section = 'blog'

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
    <CardList :list="getArticles" :section="section" />
  </main>
</template>
