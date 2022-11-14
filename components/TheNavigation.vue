<script setup lang="ts">
import { NavLinks } from '~/constants/navigation';
</script>
<template>
  <nav>
    <ul class="block lg:flex">
      <li
        v-for="(nav, index) in NavLinks"
        :key="index"
        class="pb-6 lg:pb-0 pr-6 sm:text-2xl md:text-lg"
      >
        <nuxt-link :to="nav.url" class="hover:no-underline">
          {{ nav.link }}
        </nuxt-link>
      </li>
    </ul>
  </nav>
</template>
