<template>
  <div class="p-5 flex flex-col items-center">
    <h1 class="text-4xl">Adult Couter</h1>
    <div>
      <button class="bg-red-500 pr-1 pl-1 text-4xl" @click="minusAdult">
        -
      </button>
      <span class="text-2xl">Adult</span>
      <button class="bg-red-500 pr-1 pl-1 text-4xl" @click="addAdult">
        +
      </button>
      <p class="text-2xl text-orange-900 text-center">{{ adult }} adults</p>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      adult: 0,
    }
  },
  methods: {
    addAdult() {
      this.adult += 1
    },
    minusAdult() {
      this.adult -= 1
    },
  },
}
</script>
