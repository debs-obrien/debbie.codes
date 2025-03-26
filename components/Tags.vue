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

const { data } = await useAsyncData(`tags-${props.section}`, () => queryCollection(props.section)
  .select('tags')
  .all());
  
const articleTags = Array.isArray(data.value) ? [...new Set(flatten(data.value, 'tags'))] : [];
const sortedArticleTags = articleTags.sort()
</script>

<template>
  <ul
    aria-label="topics" class="max-w-4xl flex justify-left md:justify-center items-center gap-2 my-4 mx-0 md:mx-auto border border-transparent rounded-lg overflow-x-scroll md:overflow-visible flex-nowrap md:flex-wrap font-normal md:text-sm sm:text-xl text-white uppercase"
  >
    <li class="flex gap-2 justify-center flex-nowrap">
      <NuxtLink
        :to="`/${section}`"
        class="px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      >
        All
      </NuxtLink>
    </li>
    <li
      v-for="(tag, i) in sortedArticleTags"
      :key="tag+i" class="flex gap-2 justify-center flex-nowrap "
    >
      <NuxtLink
        :to="`/${section}/tags/${tag}`"
        class="px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      >
        {{ replaceHyphen(tag) }}
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped>
.router-link-exact-active {
  background-color: #3b82f6; /* Tailwind's bg-blue-500 */
}
</style> 