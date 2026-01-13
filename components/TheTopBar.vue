<script setup lang="ts">
const isOpen = ref(false)

function toggle() {
  isOpen.value = !isOpen.value
}
</script>

<template>
  <div>
    <header class="w-full fixed top-0 left-0 z-10 bg-dark py-4 shadow-lg">
      <div class="container mx-auto">
        <div class="w-100 h-auto items-center flex justify-between px-4 sm:px-6 lg:px-3">
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
            <TheNavigation class="text-white hidden lg:block" />
          </div>
          <div class="inline-flex justify-between hidden lg:block">
            <TopBarSocial />
          </div>

          <button
            class="block lg:hidden"
            aria-label="open menu"
            type="button"
            @click="toggle"
          >
            <ul v-if="!isOpen" class="hamburger text-white">
              <li class="bg-white" />
              <li class="bg-white" />
              <li class="bg-white" />
            </ul>
            <span
              v-if="isOpen"
              class="text-white text-2xl"
              aria-label="close menu"
            >
              X
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay - Outside header for proper z-index stacking -->
    <Teleport to="body">
      <div
        v-show="isOpen"
        class="fixed inset-0 text-white w-full px-10 pt-6 text-center lg:hidden"
        style="background-color: #091a28; z-index: 9999;"
      >
        <button
          class="absolute top-4 right-4 text-white text-3xl font-bold p-2 hover:text-primary"
          aria-label="close menu"
          type="button"
          @click="isOpen = false"
        >
          ✕
        </button>
        <div class="mt-16">
          <TheNavigation @navigate="isOpen = false" />
          <TopBarSocial />
        </div>
      </div>
    </Teleport>
  </div>
</template>

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
