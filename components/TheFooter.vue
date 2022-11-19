<script setup>
import { NavLinks } from '~/constants/navigation'
</script>

<template>
  <footer class="w-full bg-dark py-12 overflow-hidden sm:px-6 lg:px-8 mt-12">
    <ul class="-mx-5 -my-2 flex flex-wrap justify-center text-white">
      <li
        v-for="(nav, index) in NavLinks"
        :key="index"
        class="pb-6 lg:pb-0 pr-6"
      >
        <NuxtLink :to="nav.url" class="hover:no-underline">
          {{ nav.link }}
        </NuxtLink>
      </li>
    </ul>

    <ul class="mt-8 flex flex-wrap justify-center space-x-6 mb-6">
      <li>
        <a
          href="https://twitter.com/debs_obrien"
          aria-label="twitter"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconTwitter class="h-10 w-10 mb-6" />
        </a>
      </li>

      <li>
        <a
          href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="linkedIn"
        >
          <IconLinkedIn class="h-10 w-10" />
        </a>
      </li>

      <li>
        <a
          href="https://www.youtube.com/c/DebbieOBrien"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="youtube"
        >
          <IconYouTube class="h-10 w-10" />
        </a>
      </li>
      <li>
        <a
          href="https://www.twitch.tv/debs_obrien"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="twitch"
        >
          <IconTwitch class="h-10 w-10" />
        </a>
      </li>

      <li>
        <a
          href="https://github.com/debs-obrien"
          aria-label="github"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconGitHub class="github" />
        </a>
      </li>
      <li>
        <a
          href="https://dev.to/debs_obrien"
          aria-label="dev to"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconDevto class="h-10 w-10" />
        </a>
      </li>

      <li>
        <a
          href="https://noti.st/debbie"
          aria-label="speaker profile"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconSpeaker class="h-10 w-10 fill-white" />
        </a>
      </li>
      <li>
        <a
          href="https://www.buymeacoffee.com/debbieobrien"
          aria-label="buy me a coffee"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconCoffee class="h-10 w-10" />
        </a>
      </li>
    </ul>
    <p class="mt-8 text-center text-gray-400">
      &copy; Debbie O'Brien, Palma de Mallorca, Spain
    </p>
  </footer>
</template>

<style scoped>
.github {
  width: 2.25rem;
}
</style>
