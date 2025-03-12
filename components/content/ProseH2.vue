<template>
  <h2
    class="font-sans text-center mt-16 text-3xl font-semibold sm:text-4xl sm:leading-none md:text-5xl"
    :id="id"
  >
    <slot>Title</slot>
  </h2>
</template>

<script setup>
defineProps({
  id: String
})
</script>
