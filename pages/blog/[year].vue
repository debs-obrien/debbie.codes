<script setup lang="ts">
import type { BlogPost, Sections } from '~/types'

const route = useRoute()
const year = route.params.year as string

// Validate year format
if (!/^\d{4}$/.test(year)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid year format' })
}

// Fetch posts for the specified year
const { data: articles } = await useAsyncData(`blog-year-${year}`,
  () => queryCollection('blog')
    .where('date', '>=', `${year}-01-01`)
    .where('date', '<', `${parseInt(year) + 1}-01-01`)
    .order('date', 'DESC')
    .all(),
)

// Debug year filtering
if (process.dev) {
  console.log(`Articles for year ${year}:`, articles.value?.length)
  if (articles.value && articles.value.length > 0) {
    console.log('First few articles:', articles.value.slice(0, 3).map(a => ({ title: a.title, date: a.date })))
  }
}

// Check if year has any posts
if (!articles.value || articles.value.length === 0) {
  // Let's see all articles and their dates to debug
  console.log('No articles found for year:', year)
  
  throw createError({ statusCode: 404, statusMessage: `No blog posts found for ${year}` })
}

const filteredArticles = ref<BlogPost[]>(articles.value || [])

const title: string = `Blog Posts from ${year}`
const description: string = `Browse all blog posts from ${year}`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search within year -->
    <BlogSearch
      :articles="articles || []"
      v-model:filteredArticles="filteredArticles"
      :showImages="false"
    />
    
    <!-- Year summary -->
    <div class="mb-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
      <h2 class="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
        Posts from {{ year }}
      </h2>
      <p class="text-blue-700 dark:text-blue-300">
        {{ articles?.length || 0 }} post{{ (articles?.length || 0) !== 1 ? 's' : '' }} published in {{ year }}
      </p>
    </div>
    
    <!-- Posts List -->
    <ItemList 
      v-if="filteredArticles.length > 0" 
      :list="filteredArticles" 
      :section="section" 
      :showImages="false" 
    />
    
    <!-- No Results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found matching your search in {{ year }}.</p>
    </div>
    
    <!-- Back to blog navigation -->
    <div class="mt-8 text-center">
      <NuxtLink 
        to="/blog" 
        class="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200 font-medium"
      >
        <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
        Back to Blog
      </NuxtLink>
    </div>
  </PageLayout>
</template>