<script setup lang="ts">
const title = 'Page not found'
const description = 'Sorry, that page does not exist. Try the blog, videos, or head back home.'

useHead({
  title,
  meta: [
    { name: 'description', content: description },
    { property: 'og:title', content: `${title} · Debbie Codes` },
    { name: 'twitter:title', content: `${title} · Debbie Codes` },
  ],
})
</script>

<template>
  <main>
    <div
      class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16 mb-16"
    >
      <div class="w-full xl:w-1/2 relative pb-12 lg:pb-0">
        <h1 class="my-2 font-bold text-2xl">
          Ooops looks like that page doesn't exist
        </h1>
        <p class="my-2 mb-8">
          Sorry about that. No idea what went wrong but hey, nobody's perfect.
          Let's take you somewhere that actually exists.
        </p>
        <NuxtLink
          to="/"
          class="sm:w-full lg:w-auto my-2 border rounded md py-4 px-8 text-center bg-primary-fill text-white hover:bg-primary-fill/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
        >
          Take me there!
        </NuxtLink>
        <nav
          aria-label="Helpful links"
          class="mt-6 flex flex-wrap gap-x-6 gap-y-2"
        >
          <NuxtLink
            to="/blog"
            class="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded"
          >
            Blog
          </NuxtLink>
          <NuxtLink
            to="/videos"
            class="text-primary font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50 rounded"
          >
            Videos
          </NuxtLink>
        </nav>
      </div>
      <NuxtImg
        src="/images/broken-connection.webp"
        alt="broken connection"
        width="444"
        height="256"
        sizes="sm:355px md:320px lg:480px"
        densities="x1 x2"
        format="webp"
        loading="eager"
        decoding="async"
      />
    </div>
  </main>
</template>
