<script>
export default {
  props: {
    id: {
      type: String,
      required: false,
    },
  },
}
</script>

<template>
  <h3 :id="id">
    <slot />
  </h3>
</template>
