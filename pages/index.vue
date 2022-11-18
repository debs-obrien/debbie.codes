<script setup>
const limit = ref(3)
const getArticles = await queryContent('blog')
  .where({ published: { $ne: false } })
  .skip(1)
  .sort({ date: -1 })
  .limit(limit.value)
  .find()

const featuredPost = await queryContent('blog')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .limit(1)
  .findOne()

const getTalks = await queryContent('videos')
  .where({ published: { $ne: false } })
  .sort({ date: -1 })
  .limit(limit.value)
  .find()

const getInterviews = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .only(['title', 'date', 'slug', 'image', 'tags', 'url', 'description'])
  .sort({ date: -1 })
  .limit(limit.value)
  .find()
</script>

<template>
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
        Senior Program Manager at Microsoft
      </p>
      <p>
        <a
          href="https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Google GDE
        </a>
        |
        <a
          href="https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Former Microsoft MVP
        </a>

        |
        <a
          href="https://stars.github.com/profiles/debs-obrien/"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          GitHub Star Alumni
        </a>
      </p>
      <p class="mt-4">
        <a
          href="https://cloudinary.com/mde"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Cloudinary MDE
        </a>
        |
        <a
          href="https://auth0.com/ambassador-program/"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Auth0 Ambassador
        </a>
        |
        <a
          href="https://nuxtjs.org/team"
          target="_blank"
          rel="nofollow noopener noreferrer"
        >
          Nuxt Ambassador
        </a>
      </p>
    </div>
  </div>

  <AppSubtitle>Featured Post</AppSubtitle>
  <FeaturedSection :item="featuredPost" section="blog" />

  <section>
    <NuxtLink to="/videos">
      <AppSubtitle>Recent Videos</AppSubtitle>
    </NuxtLink>
    <div
      class="text-left mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="video of getTalks"
        :key="video._path"
      >
        <VideoCard :item="video" :description="false" />
      </div>
    </div>
  </section>

  <section>
    <NuxtLink to="/blog">
      <AppSubtitle>Recent Blog Posts</AppSubtitle>
    </NuxtLink>
    <div
      class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="article of getArticles"
        :key="article._path"
        class="flex flex-col"
      >
        <BlogCard :item="article" :description="false" />
      </div>
    </div>
  </section>

  <section>
    <NuxtLink to="/podcasts">
      <AppSubtitle>Recent Podcasts</AppSubtitle>
    </NuxtLink>

    <div
      class="text-left mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
    >
      <div
        v-for="interview of getInterviews"
        :key="interview._path"
        class="flex flex-col"
      >
        <PodCastCard :item="interview" :description="false" />
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero_texts .subtitle {
  font-size: 22px;
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
