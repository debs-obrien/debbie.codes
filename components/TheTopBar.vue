<script lang="ts">
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

<template>
  <header class="w-full fixed top-0 left-0 z-10 bg-dark py-4">
    <div class="container mx-auto">
      <div class="w-100 h-auto items-center flex justify-between px-3">
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
          <ul class="flex gap-4 text-white mr-5">
            <li>
              <a
                href="https://twitter.com/debs_obrien"
                aria-label="twitter"
                target="_blank"
                rel="nofollow noopener noreferrer"
              ><IconTwitterWhite /></a>
            </li>
            <li>
              <a
                href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="linkedIn"
              ><IconLinkedInWhite /></a>
            </li>
            <li>
              <a
                href="https://github.com/debs-obrien"
                aria-label="github"
                target="_blank"
                rel="nofollow noopener noreferrer"
              ><IconGitHub /></a>
            </li>
            <li>
              <a
                href="https://www.youtube.com/c/DebbieOBrien"
                target="_blank"
                rel="nofollow noopener noreferrer"
                aria-label="youtube"
              ><IconYouTubeWhite /></a>
            </li>
            <li><ColorMode /></li>
          </ul>
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

    <!-- Dropdown -->
    <div
      v-show="isOpen"
      class="text-white bg-dark w-full h-full px-10 mt-6 text-center"
      @click="isOpen = false"
    >
      <TheNavigation />
      <ul class="flex gap-6 text-white justify-center mt-4">
        <li>
          <a
            href="https://twitter.com/debs_obrien"
            aria-label="twitter"
            target="_blank"
            rel="nofollow noopener noreferrer"
          ><IconTwitterWhite class="w-7 h-7" /></a>
        </li>
        <li>
          <a
            href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
            target="_blank"
            rel="nofollow noopener noreferrer"
            aria-label="linkedIn"
          ><IconLinkedInWhite class="w-7 h-7" /></a>
        </li>
        <li>
          <a
            href="https://github.com/debs-obrien"
            aria-label="github"
            target="_blank"
            rel="nofollow noopener noreferrer"
          ><IconGitHub class="w-5 h-5" /></a>
        </li>
        <li>
          <a
            href="https://www.youtube.com/c/DebbieOBrien"
            target="_blank"
            rel="nofollow noopener noreferrer"
            aria-label="youtube"
          ><IconYouTubeWhite class="w-7 h-7" /></a>
        </li><li><ColorMode class="w-7 h-7" /></li>
      </ul>
    </div>
    <!-- /Dropdown -->
  </header>
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
