<script setup lang="ts">
type Scheme = 'light' | 'dark'

const colorMode = useColorMode()

function systemScheme(): Scheme {
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Two-state toggle: always switch to the opposite of what is on screen.
// If that matches the OS setting, go back to following the system
// instead of pinning it, so every click visibly changes the theme.
function toggleColorMode() {
  const target: Scheme = colorMode.value === 'dark' ? 'light' : 'dark'
  colorMode.preference = target === systemScheme() ? 'system' : target
}
</script>

<template>
  <!-- Icon and label follow the .dark class on <html> via CSS, not JS state, so the server render can never disagree with the client. -->
  <button
    type="button"
    class="block"
    @click="toggleColorMode"
  >
    <span class="sr-only dark:hidden">Switch to dark theme</span>
    <span class="sr-only hidden dark:inline">Switch to light theme</span>
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      class="hidden dark:block w-8 h-8 lg:h-5 lg:w-5 text-gray-50"
      viewBox="0 0 20 20"
      fill="currentColor"
    >
      <path
        d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
      />
    </svg>
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      class="block dark:hidden w-8 h-8 lg:h-5 lg:w-5"
      viewBox="0 0 20 20"
      fill="white"
    >
      <path
        fill-rule="evenodd"
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        clip-rule="evenodd"
      />
    </svg>
  </button>
</template>
