<script setup lang="ts">
interface Props {
  page: string;
  tag: string;
}

const props = defineProps<Props>();
</script>
<template>
  <li
    class="transition-all !py-0.5 hover:-translate-y-0.5 bg-slate-100 text-slate-700 text-sm p-2 py-1 rounded-md !py-0.5 h-full"
  >
    <NuxtLink :to="`/${page}/tags/${tag}`" class="font-semibold">
      {{ tag }}
    </NuxtLink>
  </li>
</template>
