<script setup lang="ts">
import type { Sections } from '~/types'

interface Props {
  section: Sections
}

const props = defineProps<Props>()

const flatten = (tags: Array<any>, key = 'tags') => {
  const _tags = tags
    .map((tag) => {
      let _tag = tag
      if (tag.tags) {
        const flattened = flatten(tag[key])
        _tag = flattened
      }
      return _tag
    })
    .flat(1)

  return _tags
}

const getAllTags: Array<any> = await queryContent(props.section)
  .where({ published: { $ne: false } })
  .only(['tags'])
  .find()

const articleTags: Array<any> = [...new Set(flatten(getAllTags))]
const sortedArticleTags = articleTags.sort()
</script>

<template>
  <ul
    aria-label="topics" class="max-w-4xl flex justify-left md:justify-center items-center gap-2 my-4 mx-0 md:mx-auto border border-transparent rounded-lg overflow-x-scroll md:overflow-visible flex-nowrap md:flex-wrap font-normal md:text-sm sm:text-xl text-white uppercase"
  >
    <li
      v-for="tag in sortedArticleTags"
      :key="tag" class="flex gap-2 justify-center flex-nowrap "
    >
      <NuxtLink

        :to="`/${section}/tags/${tag}`"
        class="px-2 py-1 !py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      >
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.router-link-exact-active {
  @apply bg-blue-500;
}
</style>
