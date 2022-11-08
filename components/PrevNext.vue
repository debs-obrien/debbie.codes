<script setup>
defineProps(['prev', 'next']);
</script>

<template>
  <ul class="lex gap-4 justify-between p-4 border border-slate-200 rounded-lg">
    <li class="link-item prev">
      <NuxtLink v-if="prev" :to="prev._path">
        <span> {{ prev.title }} </span>
      </NuxtLink>
    </li>
    <li class="next">
      <NuxtLink v-if="next" :to="next._path" class="lex gap-2">
        <span> {{ next.title }} </span>
      </NuxtLink>
    </li>
  </ul>
</template>
