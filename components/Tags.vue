<script setup lang="ts">
interface Props {
  page: string;
}

const props = defineProps<Props>();

const flatten = (tags: Array<any>, key: string = 'tags') => {
  let _tags = tags
    .map((tag) => {
      let _tag = tag;
      if (tag['tags']) {
        let flattened = flatten(tag[key]);
        _tag = flattened;
      }
      return _tag;
    })
    .flat(1);

  return _tags;
};
const getAllTags: Array<any> = await queryContent(props.page)
  .where({ published: { $ne: false } })
  .only(['tags'])
  .sort({ tags: 1 })
  .find();

const articleTags: Array<any> = [...new Set(flatten(getAllTags))];
const sortedArticleTags = Array.from(articleTags).sort((a, b) => a - b);
</script>
<template>
  <div
    class="m-auto max-w-4xl flex justify-center items-center gap-2 p-2 border border-transparent rounded-lg"
  >
    <ul class="flex gap-2 py-2 flex flex-wrap justify-center">
      <li
        v-for="(tag, n) in sortedArticleTags"
        :key="n"
        class="transition-all !py-0.5 hover:-translate-y-0.5 bg-slate-100 text-slate-700 text-sm p-2 py-1 rounded-md !py-0.5 h-full"
      >
        <NuxtLink :to="`/${page}/tags/${tag}`" class="font-semibold">
          {{ tag }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
