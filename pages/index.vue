<script setup lang="ts">
const articles: Array<any> = await queryContent('blog')
  .where({ published: { $ne: false } })
  .without('body')
  .skip(1)
  .sort({ date: -1 })
  .limit(6)
  .find()

const featuredPost: any = await queryContent('blog')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(1)
  .findOne()

const videos: Array<any> = await queryContent('videos')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(5)
  .find()

const podcasts: Array<any> = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(3)
  .find()
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
      <NuxtLink to="/blog">
        <AppSubtitle>Recent Blog Posts</AppSubtitle>
      </NuxtLink>
      <CardList :list="articles" section="blog" />
    </section>

    <section>
      <NuxtLink to="/videos">
        <AppSubtitle>Recent Videos</AppSubtitle>
      </NuxtLink>

      <VideoList :list="videos" />
    </section>

    <section>
      <NuxtLink to="/podcasts">
        <AppSubtitle>Recent Podcasts</AppSubtitle>
      </NuxtLink>

      <CardList :list="podcasts" section="podcasts" />
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
