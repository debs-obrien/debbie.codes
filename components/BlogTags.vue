<template>
  <div class="buttons flex flex-wrap mt-8 justify-center">
    <div v-for="(tag, i) in tags" :key="i">
      <nuxt-link class="btn capitalize" :to="`/blog/${tag}/1`">
        {{ tag }}
      </nuxt-link>
    </div>
    <div>
      <nuxt-link class="btn" :to="`/blog/all/1`">All</nuxt-link>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        tags: [
          'nuxt',
          'react',
          'testing',
          'javascript',
          'typescript',
          'performance',
          'lifestyle'
        ]
      }
    }
  }
</script>
<style scoped>
  .btn {
    --bg-opacity: 1;
    background-color: #d8002d;
    background-color: rgba(216, 0, 45, var(--bg-opacity));
    --text-opacity: 1;
    color: #fff;
    color: rgba(255, 255, 255, var(--text-opacity));
    padding: 0.5rem;
    border-radius: 0.25rem;
    --border-opacity: 1;
    border: 2px solid #d8002d;
    border-color: rgba(216, 0, 45, var(--border-opacity));
    /* font-family: Saira; */
    letter-spacing: 0.5px;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
</style>
