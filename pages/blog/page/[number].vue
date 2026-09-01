<script setup lang="ts">
import type { Sections } from '~/types'

const route = useRoute()
const page = Number.parseInt(route.params.number as string) || 1
const postsPerPage = 12

// Calculate offset
const offset = (page - 1) * postsPerPage

// Fetch paginated posts
const { data: posts } = await useAsyncData(`blog-page-${page}`, () => queryCollection('blog')
  .select(...blogPreviewFields)
  .order('date', 'DESC')
  .limit(postsPerPage)
  .skip(offset)
  .all())

// Get total count for pagination
const { data: totalCount } = await useAsyncData('blog-total-count', () => queryCollection('blog')
  .count())

// Fetch all posts for search functionality
const { data: allPosts } = await useAsyncData('all-blog-posts', () => queryCollection('blog')
  .select(...blogPreviewFields)
  .order('date', 'DESC')
  .all())

const filteredArticles = ref<any[]>(posts.value || [])
const isSearchActive = ref(false)

const totalPages = computed(() => {
  if (!totalCount.value)
    return 1
  return Math.ceil(totalCount.value / postsPerPage)
})

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!allPosts.value)
    return []

  const tagCounts = new Map<string, { count: number, displayName: string }>()

  allPosts.value.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        // Normalize tag: trim, lowercase for comparison, remove extra spaces
        const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
        if (normalizedTag) {
          const displayName = getTagDisplayName(normalizedTag)

          if (tagCounts.has(normalizedTag)) {
            tagCounts.get(normalizedTag)!.count += 1
          }
          else {
            tagCounts.set(normalizedTag, { count: 1, displayName })
          }
        }
      })
    }
  })

  // Define custom sort order for featured tags
  const customOrder = ['ai', 'mcp', 'playwright', 'testing', 'react', 'performance', 'personal']

  // Convert to array
  const allTags = Array.from(tagCounts.entries())
    .map(([tag, { count, displayName }]) => ({ tag, count, displayName }))

  // Sort with custom order first, then by count
  return allTags.sort((a, b) => {
    const aIndex = customOrder.indexOf(a.tag)
    const bIndex = customOrder.indexOf(b.tag)

    // If both are in custom order, sort by custom order
    if (aIndex !== -1 && bIndex !== -1) {
      return aIndex - bIndex
    }
    // If only a is in custom order, a comes first
    if (aIndex !== -1)
      return -1
    // If only b is in custom order, b comes first
    if (bIndex !== -1)
      return 1
    // Otherwise sort by count
    return b.count - a.count
  }).slice(0, 8)
})

// Get years for archive navigation
const postYears = computed(() => {
  if (!allPosts.value)
    return []

  const yearCounts = new Map<string, number>()
  allPosts.value.forEach((post: any) => {
    if (post.date) {
      const postYear = new Date(post.date).getFullYear().toString()
      yearCounts.set(postYear, (yearCounts.get(postYear) || 0) + 1)
    }
  })

  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

// Handle case where page number is invalid
if (page < 1 || (totalCount.value && page > Math.ceil(totalCount.value / postsPerPage))) {
  throw createError({ statusCode: 404, statusMessage: 'Page Not Found' })
}

const recentYears = computed(() => postYears.value.slice(0, 4))

const title: string = page === 1 ? 'Blog' : `Blog - Page ${page}`
const description: string = 'Writing on testing, AI, Playwright, and the web.'
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
      @update:filtered-articles="filteredArticles = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Year - Compact Design -->
    <section v-if="recentYears.length > 0 || popularTags.length > 0" class="mb-8 max-w-4xl mx-auto">
      <!-- Tags Row -->
      <div v-if="popularTags.length > 0" class="flex flex-wrap gap-3 justify-center items-center mb-4">
        <TagChip
          v-for="{ tag, displayName } in popularTags"
          :key="tag"
          :to="`/blog/tags/${tag}`"
          :label="displayName"
          hash
        />
      </div>

      <!-- Years Row — recent years only -->
      <div v-if="recentYears.length > 0" class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="{ year } in recentYears"
          :key="year"
          :to="`/blog/year/${year}`"
          :label="year"
        />
      </div>
    </section>

    <!-- Posts List -->
    <FeaturedSection
      v-if="filteredArticles.length > 0"
      :items="filteredArticles"
      :section="section"
    />

    <!-- No Results -->
    <div v-else class="text-center py-8">
      <p class="text-gray-600 dark:text-gray-400">
        No articles found matching your search.
      </p>
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
