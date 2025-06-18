<script setup lang="ts">
import type { Sections, BlogPost } from '~/types'

const { data: articles } = await useAsyncData('articles',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

const filteredArticles = ref<BlogPost[]>(articles.value || [])

const title: string = 'All Blog Posts'
const description: string = 'Here\'s a list of all my blog posts'
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <BlogSearch
      :articles="articles || []"
      v-model:filteredArticles="filteredArticles"
      :showImages="false"
    />
    <ItemList v-if="filteredArticles.length > 0" :list="filteredArticles" :section="section" :showImages="false" />
    <div v-else class="text-center py-8">
      <p class="text-gray-600">No articles found matching your search.</p>
    </div>
  </PageLayout>
</template>
