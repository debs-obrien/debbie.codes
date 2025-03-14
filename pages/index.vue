<script setup lang="ts">

const { data: articles } = await useAsyncData('articles-home',
  () => queryCollection('blog')
    .skip(1)
    .limit(6)
    .all()
)

const { data: featuredPost } = await useAsyncData('featured-article',
  () => queryCollection('blog')
    .order('date', 'DESC')
    .limit(1)
    .first()
)

const { data: videos } = await useAsyncData('videos-home',
  () => queryCollection('videos')
    .order('date', 'DESC')
    .limit(4)
    .all()
)

const { data: podcasts } = await useAsyncData('podcasts-home',
  () => queryCollection('podcasts')
    .order('date', 'DESC')
    .limit(3)
    .all()
)
</script>

<template>
  <div>
    <div class="hero_texts text-center px-2">
      <div class="hero_image flex justify-center">
        <NuxtImg
          provider="cloudinary"
          class="rounded-full mb-4 mt-8 profile-pic border-white border"
          src="c_fill,ar_1:1,g_auto,r_max,q_auto,fl_lossy,f_auto/v1589119213/debbie.codes/debbie-thumb_clt00n"
          alt="Debbie O'Brien"
          quality="80"
          format="webp"
        />
      </div>
      <h1 class="name dark:text-white uppercase mb-4">
        Debbie
        <span class="text-primary">O'Brien</span>
      </h1>

      <div class="dark:text-white subtitle font-medium mb-20">
        <p class="mb-4">
          Principal Technical Program Manager at Microsoft
        </p>
        <p>
          <a
            href="https://developers.google.com/community/experts/directory/profile/profile-debbie-o-brien"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Google GDE
          </a>
          |
          <a
            href="https://mvp.microsoft.com/en-us"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Former Microsoft MVP
          </a>

          |
          <a
            href="https://stars.github.com/alumni/"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            GitHub Star Alumni
          </a>
        </p>
        <p class="mt-4">
 
          <a
            href="https://nuxtjs.org/teams/"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Nuxt Ambassador
          </a>
        </p>
      </div>
    </div>

    <AppSubtitle id="featured-posts">Featured Post</AppSubtitle>
    <FeaturedSection v-if="featuredPost !== null" aria-labelledby="featured-posts" :item="featuredPost" section="blog" />

    <AppSubtitle id="featured-posts">Featured Podcast</AppSubtitle>
    <FeaturedPodcast v-if="featuredPost !== null" aria-labelledby="featured-podcast" />

    <section aria-labelledby="recent-posts">
      <NuxtLink to="/blog">
        <AppSubtitle id="recent-posts">
          Recent Blog Posts
        </AppSubtitle>
      </NuxtLink>
      <CardList v-if="articles !== null" :list="articles" section="blog" />
    </section>

    <section aria-labelledby="recent-videos">
      <NuxtLink to="/videos">
        <AppSubtitle id="recent-videos">
          Recent Videos
        </AppSubtitle>
      </NuxtLink>

      <VideoList v-if="videos !== null" :list="videos" />
    </section>

    <section aria-labelledby="recent-podcasts">
      <NuxtLink to="/podcasts">
        <AppSubtitle id="recent-podcasts">
          Recent Podcasts
        </AppSubtitle>
      </NuxtLink>

      <CardList v-if="podcasts !== null" :list="podcasts" section="podcasts" />
    </section>
  </div>
</template>

<style scoped>
.hero_texts .subtitle {
  font-size: 1.25rem;
}

.hero_texts .name {
  font-size: 75px;
  border: none;
}
.profile-pic {
  height: 180px;
  width: 180px;
}

@media (max-width: 768px) {
  .hero_texts .name {
    font-size: 50px;
  }
}
</style>
