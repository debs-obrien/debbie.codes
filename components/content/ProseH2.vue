<script>
export default {
  props: {
    id: {
      type: String,
      required: true,
    },
  },
}
</script>

<template>
  <h2 :id="id">
    <slot />
  </h2>
</template>
