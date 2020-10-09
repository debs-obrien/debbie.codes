<template>
  <div class="flex">
    <main>
      <h1 class="text-4xl mb-4 leading-none">
        {{ page.title }}
      </h1>
      <!-- {{ stats.text }} -->
      <nuxt-content :document="page" class="mb-16" />
      <div class="border-solid border-t-4 border-gray-600 pt-4">
        <h3>Check out some of my other posts:</h3>
      </div>
      <ArticlePrevNext :prev="prev" :next="next" class="mt-4" />
    </main>
    <aside class="hidden lg:block">
      <ul>
        <li v-for="article of articles" :key="article.slug" class="pb-2">
          <NuxtLink :to="`/blog/${article.slug}`">
            {{ article.title }}
          </NuxtLink>
        </li>
      </ul>
    </aside>
  </div>
</template>

<script>
  const readingTime = require('reading-time')

  export default {
    layout: 'blog',
    async asyncData({ $content, params }) {
      const slug = params.slug || 'index'

      const page = await $content('articles', slug).fetch()
      const articles = await $content('articles')
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .fetch()

      const [prev, next] = await $content('articles')
        .only(['title', 'slug', 'description', 'image'])
        .where({ published: { $ne: false } })
        .sortBy('date', 'desc')
        .surround(slug)
        .fetch()

      const stats = readingTime(page)

      return {
        page,
        prev,
        next,
        stats,
        articles
      }
    }
  }
</script>

<style lang="postcss" scoped>
  aside ul {
    top: 6rem;
    position: sticky;
  }
  .dark-mode .nuxt-content {
    & h2,
    & h3,
    & blockquote {
      @apply border-gray-800;
    }

    & > code,
    & li > code,
    & p > code,
    & h3 > code {
      @apply bg-gray-800;
    }
  }

  .nuxt-content h1 {
    @apply text-3xl font-black mb-4 pb-1 border-b -mt-16 pt-24;

    & > a {
      @apply ml-6;
      &::before {
        content: '#';
        @apply text-green-500 font-normal -ml-6 pr-1 absolute opacity-100;
      }
    }

    &:hover {
      & > a::before {
        @apply opacity-100;
      }
    }
  }
  .nuxt-content h3,
  h3 {
    @apply text-xl font-extrabold mb-2 pb-1 -mt-16 pt-20;

    & > a {
      @apply ml-6;
      &::before {
        content: '#';
        @apply text-green-500 font-normal -ml-5 pr-1 absolute opacity-100;
      }
    }

    &:hover {
      & > a::before {
        @apply opacity-100;
      }
    }
  }

  @screen lg {
    .nuxt-content h2 a,
    .nuxt-content h3 a {
      @apply ml-0;
      &::before {
        @apply opacity-0;
      }
    }
  }

  .nuxt-content ul,
  .nuxt-content ol {
    @apply list-disc list-inside mb-4;

    & > li {
      @apply leading-7;

      & > ul {
        @apply pl-4;
      }
    }
  }

  .nuxt-content ol {
    @apply list-decimal;
  }

  .nuxt-content {
    & a {
      @apply underline;
    }

    & p {
      @apply mb-4 leading-7;
    }

    & > blockquote {
      @apply py-2 pl-4 mb-4 border-l-4;

      & p:last-child {
        @apply mb-0;
      }
    }

    & > code,
    & li > code,
    & p > code {
      @apply bg-gray-100 p-1 text-sm shadow-xs rounded;
    }

    & h3 > code {
      @apply bg-gray-100 p-1 text-lg shadow-xs rounded;
    }

    & pre[class*='language-'] {
      @apply rounded mt-0 mb-4 bg-gray-800 text-sm relative;

      > code {
        @apply bg-gray-800 relative;
        text-shadow: none;
      }
    }

    & video {
      @apply w-full border rounded shadow-md;
    }
  }

  .nuxt-content-highlight {
    @apply relative;

    & > .filename {
      @apply absolute right-0 text-gray-600 font-light z-10 mr-2 mt-1 text-sm;
    }
  }
  aside {
    min-width: 350px;
    margin-left: 40px;
    max-width: 350px;
  }
  main {
    width: auto;
  }
</style>
