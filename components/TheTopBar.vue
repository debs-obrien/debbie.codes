<script setup lang="ts">
const isOpen = ref(false)
const route = useRoute()
const dialogRef = ref<HTMLDialogElement | null>(null)
const openMenuButtonRef = ref<HTMLButtonElement | null>(null)

function openMenu() {
  const dialog = dialogRef.value
  if (!dialog || dialog.open) {
    return
  }
  isOpen.value = true
  dialog.showModal()
}

function closeMenu() {
  const dialog = dialogRef.value
  if (!dialog?.open) {
    isOpen.value = false
    return
  }
  dialog.close()
}

function onDialogClose() {
  isOpen.value = false
  nextTick(() => {
    openMenuButtonRef.value?.focus()
  })
}

watch(() => route.fullPath, () => {
  closeMenu()
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
            ref="openMenuButtonRef"
            class="block lg:hidden"
            aria-label="Open menu"
            :aria-expanded="isOpen"
            aria-haspopup="dialog"
            type="button"
            @click="openMenu"
          >
            <ul class="hamburger text-white">
              <li class="bg-white" />
              <li class="bg-white" />
              <li class="bg-white" />
            </ul>
          </button>
        </div>
      </div>
    </header>

    <!-- Mobile menu dialog — native modal for focus trap, Escape, and inert backdrop -->
    <Teleport to="body">
      <dialog
        ref="dialogRef"
        class="mobile-menu text-white w-full px-10 pt-6 text-center lg:hidden"
        aria-label="Menu"
        @close="onDialogClose"
      >
        <button
          class="absolute top-4 right-4 text-white text-3xl font-bold p-2 hover:text-primary transition-colors"
          aria-label="Close menu"
          type="button"
          @click="closeMenu"
        >
          ✕
        </button>
        <div class="mobile-menu-panel mt-16">
          <TheNavigation @navigate="closeMenu" />
          <TopBarSocial />
        </div>
      </dialog>
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
  border: none;
  margin: 0;
  max-width: none;
  max-height: none;
  width: 100%;
  height: 100%;
  padding-left: 2.5rem;
  padding-right: 2.5rem;
  padding-top: 1.5rem;
  color: white;
  text-align: center;
}

.mobile-menu::backdrop {
  background-color: #091a28;
}

.mobile-menu[open] {
  display: block;
}

.mobile-menu[open] .mobile-menu-panel {
  animation: mobile-menu-panel-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes mobile-menu-panel-in {
  from {
    opacity: 0;
    transform: translateY(-12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .mobile-menu[open] .mobile-menu-panel {
    animation: none;
  }
}
</style>
