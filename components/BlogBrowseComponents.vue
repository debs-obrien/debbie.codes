<script setup lang="ts">
// Reusable component for Browse by Topic and Browse by Year sections
// Used across blog homepage, year pages, and topic pages for consistency

interface Props {
  popularTags?: Array<{ tag: string, count: number, displayName?: string }>
  postYears?: Array<{ year: string, count: number }>
  showTags?: boolean
  showYears?: boolean
  activeTag?: string
  activeYear?: string
}

withDefaults(defineProps<Props>(), {
  showTags: true,
  showYears: true,
})
</script>

<template>
  <section v-if="(showYears && postYears && postYears.length > 0) || (showTags && popularTags && popularTags.length > 0)" class="mb-12 max-w-4xl mx-auto">
    <div v-if="showTags && popularTags && popularTags.length > 0" class="flex flex-wrap gap-2 justify-center mb-6">
      <TagChip
        v-for="{ tag, displayName } in popularTags"
        :key="tag"
        :to="`/blog/tags/${tag}`"
        :label="displayName || tag.replace('-', ' ')"
        hash
        variant="pill"
        :active="!!activeTag && tag === activeTag"
      />
    </div>

    <div v-if="showYears && postYears && postYears.length > 0" class="flex flex-wrap gap-2 justify-center">
      <TagChip
        v-for="{ year } in postYears"
        :key="year"
        :to="`/blog/year/${year}`"
        :label="year"
        variant="pill"
        :active="!!activeYear && year === activeYear"
      />
    </div>
  </section>
</template>
