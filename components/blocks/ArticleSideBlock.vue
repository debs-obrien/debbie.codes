<template>
  <nuxt-link
    :to="{
      name: 'blog-devTo-debs_obrien-article',
      params: { username: article.user.username, article: article.id }
    }"
    tag="article"
  >
    <div class="">
      <nuxt-link
        :to="{
          name: 'blog-devTo-debs_obrien-article',
          params: {
            username: article.user.username,
            article: article.id
          }
        }"
      >
        <h3>{{ article.title }}</h3>
      </nuxt-link>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: {
    article: {
      type: Object,
      default: null
    }
  }
}
</script>
