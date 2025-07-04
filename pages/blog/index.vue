<script setup lang="ts">
import type { Sections } from '~/types'

// Fetch featured blog posts - include featured field explicitly
const { data: allBlogPosts } = await useAsyncData('all-blog-posts-for-featured',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .all(),
)

// Filter featured posts manually
const featuredPosts = computed(() => {
  if (!allBlogPosts.value) return []
  return allBlogPosts.value
    .filter((post: any) => post.featured === true)
    .slice(0, 6)
})

// Fetch recent blog posts (latest 8)
const { data: recentPosts } = await useAsyncData('recent-blog-posts',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(8)
    .all(),
)

// Get all unique tags with counts for "Browse by Topic" section and years
const { data: allPosts } = await useAsyncData('all-blog-posts-for-tags',
  () => queryCollection('blog')
    .all(),
)

const popularTags = computed(() => {
  if (!allPosts.value) return []
  
  const tagCounts = new Map<string, number>()
  
  allPosts.value.forEach((post: any) => {
    if (post.tags) {
      post.tags.forEach((tag: string) => {
        // Normalize tag: trim, lowercase for comparison, remove extra spaces
        const normalizedTag = tag.trim().toLowerCase().replace(/\s+/g, '-')
        if (normalizedTag) {
          tagCounts.set(normalizedTag, (tagCounts.get(normalizedTag) || 0) + 1)
        }
      })
    }
  })
  
  // Convert to array and sort by count, then take top 8
  return Array.from(tagCounts.entries())
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)
})

// Get years for archive navigation with post counts
const postYears = computed(() => {
  if (!allPosts.value) return []
  
  const yearCounts = new Map<string, number>()
  allPosts.value.forEach((post: any) => {
    if (post.date) {
      const year = new Date(post.date).getFullYear().toString()
      yearCounts.set(year, (yearCounts.get(year) || 0) + 1)
    }
  })
  
  return Array.from(yearCounts.entries())
    .map(([year, count]) => ({ year, count }))
    .sort((a, b) => b.year.localeCompare(a.year))
})

const title: string = 'Blog'
const description: string = 'Thoughts on web development, testing, performance, and developer experience'
const section: Sections = 'blog'

// Debug featured posts
if (process.dev) {
  console.log('Featured posts:', featuredPosts.value?.length, featuredPosts.value)
  if (recentPosts.value?.length) {
    console.log('Recent posts sample fields:', Object.keys(recentPosts.value[0]))
    console.log('Recent posts sample featured field:', recentPosts.value[0].featured)
  }
  if (allBlogPosts.value?.length) {
    const withFeatured = allBlogPosts.value.filter((p: any) => p.featured !== undefined)
    console.log('Posts with featured field:', withFeatured.length)
    if (withFeatured.length > 0) {
      console.log('First featured post:', withFeatured[0].title, withFeatured[0].featured)
    }
  }
}

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Featured Posts Section -->
    <section v-if="featuredPosts && featuredPosts.length > 0" class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Featured Posts</h2>
      <FeaturedSection :items="featuredPosts" :section="section" />
    </section>
    
    <!-- Recent Posts Section -->
    <section class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Recent Posts</h2>
      <FeaturedSection v-if="recentPosts" :items="recentPosts" :section="section" />
      <div class="text-center mt-8">
        <NuxtLink 
          to="/blog/page/1" 
          class="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
        >
          View All Posts
        </NuxtLink>
      </div>
    </section>
    
    <!-- Browse by Topic Section -->
    <section v-if="popularTags.length > 0" class="mb-16">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Topic</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <NuxtLink
          v-for="{ tag, count } in popularTags"
          :key="tag"
          :to="`/blog/tags/${tag}`"
          class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-4 text-center font-medium text-gray-700 dark:text-gray-300 capitalize transition-colors"
        >
          <div class="font-semibold">{{ tag.replace('-', ' ') }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ count }} post{{ count !== 1 ? 's' : '' }}</div>
        </NuxtLink>
      </div>
    </section>
    
    <!-- Browse by Year Section -->
    <section v-if="postYears.length > 0">
      <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Browse by Year</h2>
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <NuxtLink
          v-for="{ year, count } in postYears"
          :key="year"
          :to="`/blog/year/${year}`"
          class="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg p-4 text-center font-medium text-gray-700 dark:text-gray-300 transition-colors"
        >
          <div class="font-semibold">{{ year }}</div>
          <div class="text-sm text-gray-500 dark:text-gray-400">{{ count }} post{{ count !== 1 ? 's' : '' }}</div>
        </NuxtLink>
      </div>
    </section>
  </PageLayout>
</template>
