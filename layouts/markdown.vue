<template>
  <div class="container">
    <ul class="flex mb-2 p-4">
      <li class="" v-for="(nav, index) in navLinks" :key="index">
        <TheNavigation :url="nav.url" :link="nav.link" />
      </li>
    </ul>
    <div class="wrapper">
      <nuxt />
    </div>
  </div>
</template>

<script>
import TheNavigation from '@/components/the-navigation'

export default {
  components: {
    TheNavigation,
  },
  data() {
    return {
      navLinks: [
        {
          url: '/',
          link: 'Home',
        },
        {
          link: 'Clicks and Methods',
          url: '/clicksmethods',
        },
        {
          url: '/conferences',
          link: 'Conferences',
        },
      ],
    }
  },
}
</script>

<style>
.wrapper {
  width: 800px;
  padding: 2rem;
  margin: 0 auto;
}
h1 {
  color: darkgreen;
  font-size: 2rem;
}
h2 {
  color: green;
  font-weight: 500;
  margin-top: 2rem;
  font-size: 1.2rem;
}
p {
  font-size: 1.2rem;
}
a:hover {
  text-decoration: underline;
}
</style>
