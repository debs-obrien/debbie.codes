<template>
  <div class="container">
    <ul class="flex mb-2">
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
          url: '/conferences',
          link: 'Conferences',
        },
        {
          link: 'Code',
          url: '/code',
        },
      ],
    }
  },
}
</script>

<style>
/* Sample `apply` at-rules with Tailwind CSS
.container {
  @apply min-h-screen flex justify-center items-center text-center mx-auto;
}
*/
.container {
  padding: 2rem;
  margin: 0 auto;
  min-height: 100vh;
}
.wrapper {
  padding: 1rem;
}

.title {
  display: block;
  font-weight: 300;
  font-size: 60px;
  color: #35495e;
  letter-spacing: 1px;
}

html {
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}

.button--green {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #3b8070;
  color: #3b8070;
  text-decoration: none;
  padding: 10px 30px;
}

.button--green:hover {
  color: #fff;
  background-color: #3b8070;
}

.button--grey {
  display: inline-block;
  border-radius: 4px;
  border: 1px solid #35495e;
  color: #35495e;
  text-decoration: none;
  padding: 10px 30px;
  margin-left: 15px;
}

.button--grey:hover {
  color: #fff;
  background-color: #35495e;
}

h1 {
  margin-top: 2rem;
  color: darkgreen;
  font-size: 2rem;
}
h2 {
  color: green;
  font-weight: 500;
  font-size: 1.2rem;
}
p {
  font-size: 1.2rem;
}
a {
  text-decoration: underline;
}
a:hover {
  color: #000;
}
section h2 {
  margin-top: 2rem;
}
</style>
