<script setup lang="ts">
import type { Sections } from '~/types'

const {
  params: { slug },
} = useRoute()

const { data: courses } = await useAsyncData(`courses-${slug}`, () => queryCollection('courses')
  .select(...coursePreviewFields)
  .where('tags', 'LIKE', `%${slug}%`)
  .order('date', 'DESC')
  .all())

const filteredCourses = ref<any[]>([])
const isSearchActive = ref(false)

// Get all courses to extract real tags
const { data: allCourses } = await useAsyncData('all-courses-for-tags-page', () => queryCollection('courses')
  .select(...coursePreviewFields)
  .all())

const courseTags = computed(() => {
  if (!allCourses.value)
    return []

  const tagCounts = new Map<string, number>()

  allCourses.value.forEach((course: any) => {
    if (course.tags) {
      course.tags.forEach((tag: string) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1)
      })
    }
  })

  // Sort by count and return top tags
  return Array.from(tagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([tag]) => tag)
})

const topic: string = replaceHyphen(slug as string)
const title: string = `Courses on ${topic}`
const description: string = ''
const section: Sections = 'courses'

useHead({
  title,
  meta: [{ name: 'description', content: description }],
})
</script>

<template>
  <PageLayout :title="title" :description="description" :section="section">
    <!-- Search Bar -->
    <BlogSearch
      :articles="allCourses || []"
      :default-articles="allCourses || []"
      @update:filtered-articles="filteredCourses = $event"
      @search-active="isSearchActive = $event"
    />

    <!-- Browse by Topic and Tag Section -->
    <section v-if="courseTags.length > 0" class="animated-section mb-8 max-w-4xl mx-auto">
      <div class="flex flex-wrap gap-3 justify-center items-center">
        <TagChip
          v-for="tag in courseTags"
          :key="tag"
          :to="`/courses/tags/${tag}`"
          :label="tag.replace('-', ' ')"
          hash
        />
      </div>
    </section>

    <!-- Courses Grid Section -->
    <section v-if="(isSearchActive ? filteredCourses : courses)?.length" class="animated-section mb-16">
      <h2 v-if="!isSearchActive" class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        {{ topic }} Courses
      </h2>
      <h2 v-else class="text-2xl font-bold text-gray-900 dark:text-white mb-6 max-w-4xl mx-auto">
        Search Results ({{ filteredCourses.length }})
      </h2>
      <ItemList :list="(isSearchActive ? filteredCourses : courses) || []" :section="section" />
    </section>

    <TagsNotFound v-else />
  </PageLayout>
</template>
