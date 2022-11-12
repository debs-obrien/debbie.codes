<template>
  <footer>
    <div class="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
      <nav
        class="-mx-5 -my-2 flex flex-wrap justify-center"
        aria-label="Footer"
      >
        <div class="px-5 py-2">
          <NuxtLink
            to="/about"
            class="text-base text-gray-800 dark:text-gray-400 hover:text-primary"
          >
            About
          </NuxtLink>
        </div>
        <div class="px-5 py-2">
          <NuxtLink
            to="/blog"
            class="text-base text-gray-800 dark:text-gray-400 hover:text-primary"
          >
            Blog
          </NuxtLink>
        </div>

        <div class="px-5 py-2">
          <NuxtLink
            to="/videos"
            class="text-base dark:text-gray-400 text-gray-800 hover:text-primary"
          >
            Videos
          </NuxtLink>
        </div>

        <div class="px-5 py-2">
          <NuxtLink
            to="/podcasts"
            class="text-base text-gray-800 dark:text-gray-400 hover:text-primary"
          >
            Podcasts
          </NuxtLink>
        </div>
      </nav>
      <div class="mt-8 flex flex-wrap justify-center space-x-6">
        <a
          href="https://twitter.com/debs_obrien"
          aria-label="twitter"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconTwitter class="h-10 w-10 mb-6 fill-current" />
        </a>

        <a
          href="https://www.linkedin.com/in/debbie-o-brien-1a199975/"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="linkedIn"
        >
          <IconLinkedIn class="h-10 w-10 fill-current" />
        </a>

        <a
          href="https://www.youtube.com/c/DebbieOBrien"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="youtube"
        >
          <IconYouTube class="h-10 w-10 fill-current" />
        </a>
        <a
          href="https://www.twitch.tv/debs_obrien"
          target="_blank"
          rel="nofollow noopener noreferrer"
          aria-label="twitch"
        >
          <IconTwitch class="h-10 w-10 fill-current" />
        </a>

        <a
          href="https://github.com/debs-obrien"
          aria-label="github"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconGitHub class="h-10 w-10 fill-current" />
        </a>
        <a
          href="https://dev.to/debs_obrien"
          aria-label="dev to"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconDevto class="h-10 w-10 fill-current" />
        </a>

        <a
          href="https://noti.st/debbie"
          aria-label="speaker profile"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconSpeaker class="h-10 w-10 fill-current" />
        </a>
        <a
          href="https://www.buymeacoffee.com/debbieobrien"
          aria-label="buy me a coffee"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          <IconCoffee class="h-10 w-10 fill-current" />
        </a>
      </div>
      <p class="mt-8 text-center text-base text-gray-800 dark:text-gray-400">
        &copy; Debbie O'Brien, Palma de Mallorca, Spain
      </p>
    </div>
  </footer>
</template>
