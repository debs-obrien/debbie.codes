<template>
  <div class="page-wrapper">
    <div
      class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="article of getArticles"
        :key="article._path"
        class="flex flex-col"
      >
        <PostsCard :item="article" />
      </div>
    </div>
    <Pagination :nextPage="nextPage" :pageNo="1" urlPrefix="/blog/all" />
  </div>
</template>

<script setup>
const route = useRoute();
const numArticles = ref(9);
const pageNo = parseInt(route.params.number);

const getArticles = await queryContent('blog')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .limit(numArticles.value)
  .skip(numArticles.value * (pageNo - 1))
  .find();

const nextPage = getArticles.length === numArticles;
</script>

<!-- <script>
  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const pageNo = parseInt(params.number)
      const numArticles = 9

      const getArticles = await $content('articles')
        .where({ published: { $ne: false } })
        .limit(numArticles)
        .skip(numArticles * (pageNo - 1))
        .sortBy('date', 'desc')
        .fetch()

      if (!getArticles.length) {
        return error({ statusCode: 404, message: 'No articles found!' })
      }

      const nextPage = getArticles.length === numArticles
      getArticles
      return {
        nextPage,
        getArticles,
        pageNo
      }
    }
  }
</script> -->
