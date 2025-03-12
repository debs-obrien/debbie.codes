<template>
  <h2
    :id="id"
    class="font-sans text-center mt-16 text-3xl font-semibold sm:text-4xl sm:leading-none md:text-5xl"
  >
    <slot>Title</slot>
  </h2>
</template>

<script setup lang="ts">
defineProps<{ id: string }>()
</script>
