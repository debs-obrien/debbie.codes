<script setup lang="ts">
const isOpen = ref(false)
const route = useRoute()

function toggle() {
  isOpen.value = !isOpen.value
}

watch(() => route.fullPath, () => {
  isOpen.value = false
})
</script>

<template>
  <div>
    <header class="w-full fixed top-0 left-0 z-50 bg-dark py-4 shadow-lg">
      <div class="container mx-auto">
        <div class="w-100 h-auto items-center flex justify-between px-4 sm:px-6 lg:px-3">
          <div class="w-auto text-white">
            <NuxtLink to="/" class="hover:no-underline flex">
              <NuxtImg
                provider="cloudinary"
                class="rounded-full mr-4 profile-pic border-white border"
                src="v1589118478/debbie.codes/debbie-thumb_clt00n"
                alt="Debbie O'Brien"
                width="96"
                height="96"
                sizes="50px"
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
            :aria-label="isOpen ? 'Close menu' : 'Open menu'"
            :aria-expanded="isOpen"
            type="button"
            @click="toggle"
          >
            <ul v-if="!isOpen" class="hamburger text-white">
              <li class="bg-white" />
              <li class="bg-white" />
              <li class="bg-white" />
            </ul>
            <span
              v-else
              class="text-white text-2xl"
            >
              X
            </span>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile Menu Overlay - Outside header for proper z-index stacking -->
    <Teleport to="body">
      <Transition name="mobile-menu">
        <div
          v-if="isOpen"
          class="mobile-menu fixed inset-0 text-white w-full px-10 pt-6 text-center lg:hidden"
        >
          <button
            class="absolute top-4 right-4 text-white text-3xl font-bold p-2 hover:text-primary transition-colors"
            aria-label="Close menu"
            type="button"
            @click="isOpen = false"
          >
            ✕
          </button>
          <div class="mobile-menu-panel mt-16">
            <TheNavigation @navigate="isOpen = false" />
            <TopBarSocial />
          </div>
        </div>
      </Transition>
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

.mobile-menu {
  background-color: #091a28;
  z-index: 9999;
}

.mobile-menu-enter-active,
.mobile-menu-leave-active {
  transition: opacity 0.25s ease;
}

.mobile-menu-enter-active .mobile-menu-panel,
.mobile-menu-leave-active .mobile-menu-panel {
  transition: opacity 0.28s ease, transform 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

.mobile-menu-enter-from,
.mobile-menu-leave-to {
  opacity: 0;
}

.mobile-menu-enter-from .mobile-menu-panel,
.mobile-menu-leave-to .mobile-menu-panel {
  opacity: 0;
  transform: translateY(-12px);
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu-enter-active,
  .mobile-menu-leave-active,
  .mobile-menu-enter-active .mobile-menu-panel,
  .mobile-menu-leave-active .mobile-menu-panel {
    transition: none;
  }

  .mobile-menu-enter-from .mobile-menu-panel,
  .mobile-menu-leave-to .mobile-menu-panel {
    transform: none;
  }
}
</style>
