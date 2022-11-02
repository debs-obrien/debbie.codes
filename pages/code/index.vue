<template>
  <div>
    <h1 class="main-heading"> Code </h1>
    <p class="mb-4"> Some simple code examples I have built using vue.js </p>
    <nuxt-link to="code/clicksmethods" class="button--green">
      Clicks and Methods
    </nuxt-link>
    <p class="mt-10">
      This message is coming from my serverless function called hello:
      <!-- {{ hello }} -->
    </p>
  </div>
</template>
<!-- <script>
import axios from 'axios'
export default {
  async asyncData () {
    const { data } = await axios.get(
      'https://debbie.codes/.netlify/functions/hello'
    )

    return { hello: data }
  }
}
</script> -->
