<script setup lang="ts">
import type { } from '~/types'

const props = defineProps<{
  articles: any[]
  filteredArticles: any[]
  showImages?: boolean
  defaultArticles?: any[]  // The original limited/paginated articles
}>()

const emit = defineEmits<{
  (e: 'update:filteredArticles', articles: any[]): void
  (e: 'search-active', isActive: boolean): void
}>()

const searchQuery = ref('')

// Use a direct function to filter articles
function filterArticles() {
  if (!searchQuery.value.trim()) {
    // Return default articles (limited/paginated) if no search, otherwise return all articles
    return props.defaultArticles || props.articles
  }
  
  const query = searchQuery.value.toLowerCase().trim()
  
  return props.articles.filter((article: any) => {
    // Search in title
    const titleMatch = article.title?.toLowerCase().includes(query)
    
    // Search in description  
    const descriptionMatch = article.description?.toLowerCase().includes(query)
    
    // Search in tags
    const tagMatch = article.tags?.some((tag: string) => 
      tag.toLowerCase().includes(query)
    )
    
    return titleMatch || descriptionMatch || tagMatch
  })
}

// Watch search query changes and emit filtered results
watch(searchQuery, () => {
  const filtered = filterArticles()
  emit('update:filteredArticles', filtered)
  emit('search-active', searchQuery.value.trim().length > 0)
}, { immediate: true })

// Also watch for articles prop changes
watch(() => props.articles, () => {
  const filtered = filterArticles()
  emit('update:filteredArticles', filtered)
  emit('search-active', searchQuery.value.trim().length > 0)
}, { immediate: true })
</script>

<template>
  <div class="max-w-2xl mx-auto mt-6 mb-4">
    <div class="relative">
      <input
        v-model="searchQuery"
        type="search"
        placeholder="Search articles..."
        class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"
      />
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
        </svg>
      </div>
    </div>
  </div>
</template>
