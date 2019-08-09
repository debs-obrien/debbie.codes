<template>
  <div class="p-4">
    <h1 class="text-4xl">Dropdown</h1>

    <button class="bg-green-500 hover:bg-green-200 p-2" @click="toggle">
      Dropdown
    </button>
    <div class="dropdown border-gray-600 border w-auto" v-show="isOpen">
      <ul class="p-2">
        <li>Nuxt</li>
        <li>Vue</li>
        <li>Webpack</li>
      </ul>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      isOpen: false,
    }
  },

  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    },
  },
}
</script>
<style>
.dropdown {
  max-width: 91px;
}
</style>
