<script setup lang="ts">
interface Props {
  currentPage: number
  totalPages: number
  baseUrl: string
}

const props = defineProps<Props>()

const hasPrevious = computed(() => props.currentPage > 1)
const hasNext = computed(() => props.currentPage < props.totalPages)

const previousPage = computed(() => props.currentPage - 1)
const nextPage = computed(() => props.currentPage + 1)

const pageNumbers = computed(() => {
  const pages = []
  const start = Math.max(1, props.currentPage - 2)
  const end = Math.min(props.totalPages, props.currentPage + 2)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})
</script>

<template>
  <nav class="flex justify-center items-center space-x-2 py-8" aria-label="Pagination">
    <!-- Previous Page -->
    <NuxtLink
      v-if="hasPrevious"
      :to="previousPage === 1 ? baseUrl : `${baseUrl}/page/${previousPage}`"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
      aria-label="Go to previous page"
    >
      <span class="sr-only">Previous</span>
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
      </svg>
    </NuxtLink>
    
    <!-- First page if not in range -->
    <NuxtLink
      v-if="pageNumbers[0] > 1"
      :to="baseUrl"
      class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
    >
      1
    </NuxtLink>
    
    <!-- Ellipsis if gap between first page and current range -->
    <span v-if="pageNumbers[0] > 2" class="px-3 py-2 text-sm font-medium text-gray-500">
      ...
    </span>
    
    <!-- Page numbers -->
    <NuxtLink
      v-for="page in pageNumbers"
      :key="page"
      :to="page === 1 ? baseUrl : `${baseUrl}/page/${page}`"
      :class="[
        'px-3 py-2 text-sm font-medium rounded-md',
        page === currentPage
          ? 'text-white bg-blue-600 border border-blue-600'
          : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
      ]"
      :aria-current="page === currentPage ? 'page' : undefined"
    >
      {{ page }}
    </NuxtLink>
    
    <!-- Ellipsis if gap between current range and last page -->
    <span v-if="pageNumbers[pageNumbers.length - 1] < totalPages - 1" class="px-3 py-2 text-sm font-medium text-gray-500">
      ...
    </span>
    
    <!-- Last page if not in range -->
    <NuxtLink
      v-if="pageNumbers[pageNumbers.length - 1] < totalPages"
      :to="`${baseUrl}/page/${totalPages}`"
      class="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
    >
      {{ totalPages }}
    </NuxtLink>
    
    <!-- Next Page -->
    <NuxtLink
      v-if="hasNext"
      :to="`${baseUrl}/page/${nextPage}`"
      class="px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:text-gray-700"
      aria-label="Go to next page"
    >
      <span class="sr-only">Next</span>
      <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
      </svg>
    </NuxtLink>
  </nav>
</template>