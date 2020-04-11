<template>
  <div>
    <h1>Serverless</h1>

    <p class="mt-10">
      {{ hello }}
    </p>
  </div>
</template>
<script>
import axios from 'axios'
export default {
  async asyncData() {
    const { data } = await axios.get(
      'https://debbie.codes/.netlify/functions/hello'
    )

    return { hello: data }
  }
}
</script>
