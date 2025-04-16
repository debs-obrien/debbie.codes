<template>
  <h3 :id="id">
    <slot />
  </h3>
</template>

<script>
export default {
  props: {
    id: {
      type: String,
      required: false,
    },
  },
};
</script>
