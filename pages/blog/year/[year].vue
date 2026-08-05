<script setup lang="ts">
import type { Sections } from '~/types'

const route = useRoute()
const year = route.params.year as string

// Validate year format
if (!/^\d{4}$/.test(year)) {
  throw createError({ statusCode: 404, statusMessage: 'Invalid year format' })
}

// Fetch all posts and filter by year on the client side
const { data: allArticles } = await useAsyncData(`blog-year-${year}`, () => queryCollection('blog')
  .order('date', 'DESC')
  .all())

// Filter articles for the specific year
const articles = computed(() => {
  if (!allArticles.value)
    return []

  return allArticles.value.filter((article: any) => {
    if (!article.date)
      return false
    const articleYear = new Date(article.date).getFullYear().toString()
    return articleYear === year
  })
})

const filteredArticles = ref<any[]>([])
const isSearchActive = ref(false)

// Get popular tags for browse components
const popularTags = computed(() => {
  if (!allArticles.value)
    return []

  const tagCounts = new Map<string, { count: number, displayName: string }>()

  allArticles.value.forEach((post: any) => {
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

  // Convert to array and sort by count, then take top 8
  const allTags = Array.from(tagCounts.entries())
    .map(([tag, { count, displayName }]) => ({ tag, count, displayName }))

  // Define custom order for important tags
  const customOrder = ['playwright', 'ai', 'mcp', 'javascript', 'typescript', 'vue', 'nuxt', 'react']

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

// Get years for archive navigation with post counts
const postYears = computed(() => {
  if (!allArticles.value)
    return []

  const yearCounts = new Map<string, number>()
  allArticles.value.forEach((post: any) => {
    if (post.date) {
      const postYear = new Date(post.date).getFullYear().toString()
      yearCounts.set(postYear, (yearCounts.get(postYear) || 0) + 1)
    }
  })

  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

const title: string = year
const description: string = ''
const section: Sections = 'blog'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <BlogSearch
      :articles="allArticles || []"
      :default-articles="articles"
      @update:filtered-articles="filteredArticles = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Year - Compact Design -->
    <section v-if="postYears.length > 0 || popularTags.length > 0" class="mb-8 max-w-4xl mx-auto">
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

      <!-- Years Row -->
      <div v-if="postYears.length > 0" class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="{ year: blogYear } in postYears"
          :key="blogYear"
          :to="`/blog/year/${blogYear}`"
          :label="blogYear"
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
        No articles found{{ isSearchActive ? ' matching your search' : ` for ${year}` }}.
      </p>
    </div>
  </PageLayout>
</template>
