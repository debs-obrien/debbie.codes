<template>
  <div class="">
    <!-- Topbar -->
    <div class="grax_topbar bg-black">
      <div class="mainpart">
        <div class="container p-4">
          <div class="inner flex justify-between">
            <div class="logo"></div>
            <div class="menu_list">
              <TheNavigation />
            </div>
            <button class="trigger" @click="toggle">
              <ul v-if="!isOpen" class="hamburger text-white">
                <li></li>
                <li></li>
                <li></li>
              </ul>
              <span v-if="isOpen" class="text-white">X</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Dropdown -->
      <div
        class="text-white bg-black w-full h-full px-10"
        v-show="isOpen"
        @click="isOpen = false"
      >
        <TheNavigation />
      </div>
      <!-- /Dropdown -->
    </div>
    <!-- /Topbar -->
    <div class="main-content">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TheNavigation from '@/components/the-navigation'

export default {
  components: {
    TheNavigation,
  },
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

<style scoped>
.hamburger li {
  width: 35px;
  height: 5px;
  background-color: white;
  margin: 6px 0;
}
.main-content {
  position: relative;
  top: 80px;
}
</style>
