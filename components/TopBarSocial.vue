<script setup lang="ts">
import IconLinkedInWhite from '~/components/icon/IconLinkedInWhite.vue'
import IconXWhite from '~/components/icon/IconXWhite.vue'
import IconYouTubeWhite from '~/components/icon/IconYouTubeWhite.vue'
</script>

<template>
  <ul class="flex gap-6 lg:gap-4 justify-center text-white mr-5 items-center">
    <li>
      <a
        href="https://x.com/debs_obrien"
        target="_blank"
        rel="noopener"
        aria-label="x"
        class="text-white transition duration-300 ease-in-out transform custom-hover"
      ><IconXWhite class=" w-8 h-8 lg:h-4 lg:w-4" /></a>
    </li>
    <li>
      <a
        href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="linkedIn"
      ><IconLinkedInWhite class=" w-8 h-8 lg:h-4 lg:w-4" /></a>
    </li>
    <li>
      <a
        href="https://github.com/debs-obrien"
        aria-label="github"
        target="_blank"
        rel="nofollow noopener noreferrer"
      ><IconGitHub class="w-8 h-8 lg:h-4 lg:w-4" /></a>
    </li>
    <li>
      <a
        href="https://www.youtube.com/c/DebbieOBrien"
        target="_blank"
        rel="nofollow noopener noreferrer"
        aria-label="youtube"
      ><IconYouTubeWhite class="w-8 h-8 lg:h-5 lg:w-5" /></a>
    </li>
    <li><ColorMode /></li>
  </ul>
</template>
