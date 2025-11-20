<template>
  <div>
    <CreativeHero />
    <div class="pt-8 pb-12 px-6 sm:px-8 lg:px-12 bg-white dark:bg-gray-800">
      <div class="max-w-7xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-x-16 gap-y-20">
          <section
            aria-labelledby="recent-videos"
            class="animated-section lg:col-span-2"
          >
            <NuxtLink to="/videos">
              <AppSubtitle id="recent-videos">Recent Videos</AppSubtitle>
            </NuxtLink>
            <FeaturedVideoSection v-if="videos" :list="videos" />
          </section>



          <section
            aria-labelledby="featured-podcast"
            class="animated-section"
          >
            <AppSubtitle id="featured-podcast">Featured Podcast</AppSubtitle>
            <FeaturedPodcast />
          </section>

          <section
            aria-labelledby="recent-podcasts"
            class="animated-section"
          >
            <NuxtLink to="/podcasts">
              <AppSubtitle id="recent-podcasts">Recent Podcasts</AppSubtitle>
            </NuxtLink>
            <CardList v-if="podcasts" :list="podcasts" section="podcasts" />
          </section>

          <section
            aria-labelledby="recent-posts"
            class="lg:col-span-2 animated-section"
          >
            <NuxtLink to="/blog">
              <AppSubtitle id="recent-posts">Recent Blog Posts</AppSubtitle>
            </NuxtLink>
            <BlogPostList v-if="articles" :list="articles" />
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'

const { data: articles } = await useAsyncData('articles-home', () =>
  queryCollection('blog').order('date', 'DESC').skip(1).limit(6).all()
)

const { data: featuredPosts } = await useAsyncData('featured-article', () =>
  queryCollection('blog').order('date', 'DESC').limit(2).all()
)

const { data: videos } = await useAsyncData('videos-home', () =>
  queryCollection('videos').order('date', 'DESC').limit(5).all()
)

const { data: podcasts } = await useAsyncData('podcasts-home', () =>
  queryCollection('podcasts').order('date', 'DESC').limit(2).all()
)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in')
        }
      })
    },
    { threshold: 0.1 }
  )

  document.querySelectorAll('.animated-section').forEach((section) => {
    observer.observe(section)
  })
})
</script>

<style scoped>
.animated-section {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animated-section.fade-in {
  opacity: 1;
  transform: translateY(0);
}
</style>
