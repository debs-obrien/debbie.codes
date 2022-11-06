<template>
  <header class="grax_topbar w-full fixed top-0 left-0 z-10 bg-dark py-4">
    <div class="container">
      <div class="w-100 h-auto items-center flex justify-between">
        <div class="w-auto text-white">
          <NuxtLink to="/" class="hover:no-underline flex">
            <NuxtImg
              provider="cloudinary"
              class="rounded-full mr-4 profile-pic border-white border"
              src="w_100,c_fill,ar_1:1,q_auto,fl_lossy,f_auto/v1589118478/debbie.codes/debbie-thumb_clt00n"
              alt="Debbie O'Brien"
              width="100"
              height="auto"
              quality="80"
              format="webp"
            />
            <span class="self-center text-white"> Debbie O'Brien </span>
          </NuxtLink>
        </div>
        <div class="text-white hidden lg:block">
          <TheNavigation />
        </div>
        <ColorMode />
        <button class="block lg:hidden" aria-label="open menu" @click="toggle">
          <ul v-if="!isOpen" class="hamburger text-white">
            <li class="bg-white" />
            <li class="bg-white" />
            <li class="bg-white" />
          </ul>
          <span v-if="isOpen" class="text-white" aria-label="close menu">
            X
          </span>
        </button>
      </div>
    </div>

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="text-white bg-dark w-full h-full px-10"
      @click="isOpen = false"
    >
      <TheNavigation />
    </div>
    <!-- /Dropdown -->
  </header>
</template>
<script lang="ts">
export default {
  data() {
    return {
      isOpen: false
    };
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>

<style scoped>
.hamburger li {
  width: 35px;
  height: 5px;
  margin: 6px 0;
}
.profile-pic {
  height: 50px;
  width: 50px;
}
</style>
