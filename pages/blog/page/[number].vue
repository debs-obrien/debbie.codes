<script setup lang="ts">
import type { Sections } from '~/types'

const route = useRoute()
const page = parseInt(route.params.number as string) || 1
const postsPerPage = 12

// Calculate offset
const offset = (page - 1) * postsPerPage

// Debug pagination
if (process.dev) {
  console.log(`Pagination Debug: page=${page}, postsPerPage=${postsPerPage}, offset=${offset}`)
}

// Fetch paginated posts
const { data: posts } = await useAsyncData(`blog-page-${page}`,
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(postsPerPage)
    .skip(offset)
    .all(),
)

// Debug post results
if (process.dev) {
  console.log(`Posts fetched: ${posts.value?.length || 0} posts`)
}

// Get total count for pagination
const { data: totalCount } = await useAsyncData('blog-total-count',
  () => queryCollection('blog')
    .count(),
)

// Fetch all posts for search functionality
const { data: allPosts } = await useAsyncData('all-blog-posts',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

// Debug all posts
if (process.dev) {
  console.log(`All posts fetched: ${allPosts.value?.length || 0} posts`)
}

const filteredArticles = ref<any[]>(posts.value || [])
const isSearchActive = ref(false)

const totalPages = computed(() => {
  if (!totalCount.value) return 1
  return Math.ceil(totalCount.value / postsPerPage)
})

// Handle case where page number is invalid
if (page < 1 || (totalCount.value && page > Math.ceil(totalCount.value / postsPerPage))) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const title: string = page === 1 ? 'All Blog Posts' : `Blog Posts - Page ${page}`
const description: string = page === 1 
  ? 'Browse all blog posts about web development, testing, performance, and developer experience'
  : `Browse blog posts - Page ${page} of ${totalPages.value}`
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Component -->
    <BlogSearch
      :articles="allPosts || []"
      :default-articles="posts || []"
      v-model:filteredArticles="filteredArticles"
      :showImages="false"
      @search-active="isSearchActive = $event"
    />
    
    <!-- Posts List -->
    <ItemList 
      v-if="filteredArticles.length > 0" 
      :list="filteredArticles" 
      :section="section" 
      :showImages="false" 
    />
    
    <!-- No Results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">No articles found matching your search.</p>
    </div>
    
    <!-- Pagination -->
    <Pagination
      v-if="posts && posts.length > 0 && !isSearchActive"
      :current-page="page"
      :total-pages="totalPages"
      base-url="/blog"
    />
  </PageLayout>
</template>