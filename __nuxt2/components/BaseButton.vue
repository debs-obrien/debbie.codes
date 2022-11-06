<template>
  <button
    class="bg-primary text-white py-2 px-4 rounded border-solid border-2 border-primary btn font-Saira"
    type="submit"
  >
    {{ text }}
  </button>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Send',
      required: false
    }
  }
}
</script>
<style scoped>
.btn {
  transition: all 0.3s ease;
}
.btn:hover {
  @apply text-primary bg-transparent;
}
</style>
