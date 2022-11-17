<script setup lang="ts">
defineProps(['links'])

const flattenLinks = (links: Array<any>) => {
  const _links = links
    .map((link) => {
      let _link = [link]
      if (link.children) {
        const flattened = flattenLinks(link.children)
        _link = [link, ...flattened]
      }
      return _link
    })
    .flat(1)
  return _links
}
</script>

<template>
  <nav class="p-4 bg-slate-50 border border-slate-200 rounded-lg text-dark">
    <header class="pb-2 mb-2 border-b border-slate-200">
      <h3 class="text-xl font-bold">
        Table of contents
      </h3>
    </header>
    <ul class="flex flex-col gap-2 px-2">
      <li
        v-for="link of flattenLinks(links)"
        :key="link.id"
        class="text-slate-500"
        :class="link.depth === 3 ? 'pl-3' : ''"
      >
        <a :href="`#${link.id}`" class="hover:underline">
          {{ link.text }}
        </a>
      </li>
    </ul>
  </nav>
</template>
