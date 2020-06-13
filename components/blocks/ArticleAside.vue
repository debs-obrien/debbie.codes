<template>
  <aside
    class="flex flex-col m-0 pl-8 p-2 hidden lg:block border-l border-white"
  >
    <h2 class="mb-4 text-2xl">
      Blog Articles
    </h2>
    <template v-if="$fetchState.error">
      <inline-error-block :error="$fetchState.error" />
    </template>
    <template v-else>
      <div
        class="
      "
      >
        <ArticleSideBlock
          v-for="article in articles"
          :key="article.id"
          :article="article"
          class="mb-4 text-sm"
        />
      </div>
    </template>
  </aside>
</template>

<script>
import ArticleSideBlock from '@/components/blocks/ArticleSideBlock'
import InlineErrorBlock from '@/components/blocks/InlineErrorBlock'

export default {
  components: {
    ArticleSideBlock,
    InlineErrorBlock
  },
  async fetch () {
    const res = await fetch('https://dev.to/api/articles?username=debs_obrien')
    this.articles = await res.json()
  },
  data () {
    return {
      articles: null
    }
  }
}
</script>
