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
  .find();

const articleTags: Array<any> = [...new Set(flatten(getAllTags))];
const sortedArticleTags = articleTags.sort();
</script>
<template>
  <div
    class="m-auto max-w-4xl flex justify-center items-center gap-2 p-2 border border-transparent rounded-lg"
  >
    <ul class="flex gap-2 py-2 flex flex-wrap justify-center">
      <NuxtLink
        v-for="(tag, n) in sortedArticleTags"
        :key="n"
        :to="`/${page}/tags/${tag}`"
        class="tag px-2 py-1 text-sm font-normal text-white uppercase bg-slate-600 rounded-md dark:text-white dark:bg-slate-600 transition-all !py-0.5 hover:-translate-y-0.5 hover:bg-blue-500"
      >
        <li>
          {{ tag.replaceAll('-', ' ') }}
        </li>
      </NuxtLink>
    </ul>
  </div>
</template>
<style scoped>
.tag.router-link-exact-active {
  @apply bg-blue-500;
}
</style>
