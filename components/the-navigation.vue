<template>
  <ul class="menu-list">
    <li @click="isOpen = false">
      <nuxt-link to="/" @click="isOpen = false">Home</nuxt-link>
    </li>
    <!-- <li><nuxt-link to="#about">About</nuxt-link></li>
    <li><nuxt-link to="#services">Services</nuxt-link></li>
    <li><nuxt-link to="#portfolio">Portfolio</nuxt-link></li>
    <li><nuxt-link to="#news">News</nuxt-link></li>-->
    <li @click="isOpen = false">
      <nuxt-link to="/contact">Contact</nuxt-link>
    </li>
  </ul>
</template>
<script></script>
<style scoped>
.menu-list li {
  padding-bottom: 10px;
}
.menu-list li:hover {
  text-decoration: underline;
}
</style>
