<script setup>
const flatten = (tags, key) => {
  let _tags = tags
    .map((tag) => {
      let _tag = tag;
      if (tag[key]) {
        let flattened = flatten(tag[key]);
        _tag = flattened;
      }
      return _tag;
    })
    .flat(1);

  return _tags;
};

const getAllTags = await queryContent('podcast')
  .where({ published: { $ne: false } })
  .only(['tags'])
  .sort({ tags: 1 })
  .find();

const flattenAllTags = [...new Set(flatten(getAllTags, 'tags'))];
const sortedTags = Array.from(flattenAllTags).sort((a, b) => a - b);
</script>
<template>
  <div
    class="m-auto max-w-4xl flex justify-center items-center gap-2 p-2 border border-transparent rounded-lg"
  >
    <ul class="article-tags flex flex-wrap justify-center">
      <li v-for="(tag, n) in sortedTags" :key="n" class="tag h-full">
        <NuxtLink :to="`/podcasts/tags/${tag}`" class="font-semibold">
          {{ tag }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>
