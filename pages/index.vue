<script setup lang="ts">
const { data: articles } = await useAsyncData('articles-home', () =>
  queryCollection('blog').order('date', 'DESC').limit(6).all())

const { data: videos } = await useAsyncData('videos-home', () =>
  queryCollection('videos').order('date', 'DESC').limit(5).all())

const { data: podcasts } = await useAsyncData('podcasts-home', () =>
  queryCollection('podcasts').order('date', 'DESC').limit(2).all())

const homeBody = ref<HTMLElement | null>(null)
useScrollReveal(homeBody)
</script>

<template>
  <div>
    <CreativeHero />
    <div ref="homeBody" class="home-body relative pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div class="home-fade absolute inset-x-0 top-0 h-16 pointer-events-none" aria-hidden="true" />
      <div class="relative max-w-6xl mx-auto pt-8">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-14">
          <section
            aria-labelledby="recent-videos"
            class="animated-section lg:col-span-2"
          >
            <NuxtLink to="/videos">
              <AppSubtitle id="recent-videos">
                Recent Videos
              </AppSubtitle>
            </NuxtLink>
            <FeaturedVideoSection v-if="videos" :list="videos" />
          </section>

          <section
            aria-labelledby="featured-podcast"
            class="animated-section"
          >
            <AppSubtitle id="featured-podcast">
              Featured Podcast
            </AppSubtitle>
            <FeaturedPodcast />
          </section>

          <section
            aria-labelledby="recent-podcasts"
            class="animated-section"
          >
            <NuxtLink to="/podcasts">
              <AppSubtitle id="recent-podcasts">
                Recent Podcasts
              </AppSubtitle>
            </NuxtLink>
            <div class="mt-8">
              <PodcastGrid v-if="podcasts" :list="podcasts" />
            </div>
          </section>

          <section
            aria-labelledby="recent-posts"
            class="lg:col-span-2 animated-section"
          >
            <NuxtLink to="/blog">
              <AppSubtitle id="recent-posts">
                Recent Blog Posts
              </AppSubtitle>
            </NuxtLink>
            <BlogPostList v-if="articles" :list="articles" />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-fade {
  background: linear-gradient(
    to bottom,
    rgba(9, 26, 40, 0.08),
    transparent
  );
}

:global(.dark) .home-fade {
  background: linear-gradient(
    to bottom,
    rgba(9, 26, 40, 0.45),
    transparent
  );
}
</style>
