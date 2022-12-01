<template>
  <nav>
    <ul class="block lg:flex">
      <li
        v-for="(nav, index) in NavLinks"
        :key="index"
        class="pb-8 lg:pb-0 pr-6 text-2xl lg:text-lg"
      >
        <nuxt-link :to="nav.url" class="hover:no-underline">
          {{ nav.link }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
