<template>
  <div class="grax_topbar w-full fixed top-0 left-0 z-10 bg-dark">
    <CookieBox />

    <div class="p-4">
      <div class="container">
        <div class="w-100 h-auto items-center flex justify-between">
          <div class="w-auto text-white">
            <nuxt-link to="/" class="hover:no-underline flex">
              <img
                class="rounded-full mr-4 profile-pic border-white border"
                src="https://res.cloudinary.com/debsobrien/image/upload/w_100,c_fill,ar_1:1,q_auto,f_auto/v1589118478/debbie.codes/debbie-icon_esuoiv.jpg"
                alt="Debbie O'Brien"
              />
              <span class="self-center text-white"
                >Debbie O'Brien</span
              ></nuxt-link
            >
          </div>
          <div class="text-white hidden lg:block">
            <TheNavigation />
          </div>
          <button
            class="block lg:hidden"
            aria-label="open menu"
            @click="toggle"
          >
            <ul v-if="!isOpen" class="hamburger text-white">
              <li class="bg-white"></li>
              <li class="bg-white"></li>
              <li class="bg-white"></li>
            </ul>
            <span v-if="isOpen" class="text-white" aria-label="close menu">
              X
            </span>
          </button>
        </div>
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
  </div>
</template>
<script>
import TheNavigation from '@/components/TheNavigation'
import CookieBox from '@/components/CookieBox'

export default {
  components: {
    TheNavigation,
    CookieBox
  },
  data() {
    return {
      isOpen: false
    }
  },
  methods: {
    toggle() {
      this.isOpen = !this.isOpen
    }
  }
}
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
