<template>
  <div class="container">
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
        <p class="mb-4"> Senior Program Manager at Microsoft </p>
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
      <section>
        <NuxtLink :to="{ name: 'blog' }"
          ><AppSubtitle>Recent Blog Posts</AppSubtitle></NuxtLink
        >
        <div
          class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
        >
          <div
            v-for="article of getArticles"
            :key="article.slug"
            class="flex flex-col"
            data-test-id="posts"
          >
            <PostsCard :item="article" :description="false" />
          </div>
        </div>
      </section>

      <section>
        <NuxtLink :to="{ name: 'resources-conference-talks' }"
          ><AppSubtitle>Recent Talks</AppSubtitle></NuxtLink
        >
        <div
          class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
        >
          <div v-for="video of getTalks" :key="video.slug" data-test-id="talks">
            <VideoCard :item="video" :description="false" />
          </div>
        </div>
      </section>

      <section>
        <NuxtLink :to="{ name: 'resources-courses' }"
          ><AppSubtitle>Recent Courses</AppSubtitle></NuxtLink
        >

        <div
          class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
        >
          <div
            v-for="course of getCourses"
            :key="course.slug"
            data-test-id="courses"
            class="flex flex-col"
          >
            <PostsCard :item="course" :description="false" />
          </div>
        </div>
      </section>
      <section>
        <NuxtLink :to="{ name: 'resources-interviews' }"
          ><AppSubtitle>Recent Interviews</AppSubtitle></NuxtLink
        >

        <div
          class="mt-12 grid gap-6 sm:px-8 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none"
        >
          <div
            v-for="interview of getInterviews"
            :key="interview.slug"
            data-test-id="interviews"
            class="flex flex-col"
          >
            <VideoCard :item="interview" :description="false" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>
<script>
  import AppTitle from '~/components/AppTitle.vue'
  export default {
    layout: 'home',
    async asyncData({ $content, error }) {
      const numArticles = 3
      const getArticles = await $content('articles')
        .where({
          published: { $ne: false }
        })
        .sortBy('date', 'desc')
        .limit(numArticles)
        .fetch()
      if (!getArticles.length) {
        return error({ statusCode: 404, message: 'No articles found!' })
      }
      const getTalks = await $content('conference-talks')
        .where({
          published: { $ne: false }
        })
        .sortBy('date', 'desc')
        .limit(numArticles)
        .fetch()
      if (!getTalks.length) {
        return error({ statusCode: 404, message: 'No talks found!' })
      }
      const getCourses = await $content('courses')
        .where({
          published: { $ne: false }
        })
        .sortBy('date', 'desc')
        .limit(numArticles)
        .fetch()
      if (!getCourses.length) {
        return error({ statusCode: 404, message: 'No courses found!' })
      }
      const getInterviews = await $content('interviews')
        .where({
          published: { $ne: false }
        })
        .sortBy('date', 'desc')
        .limit(numArticles)
        .fetch()
      if (!getCourses.length) {
        return error({ statusCode: 404, message: 'No interviews found!' })
      }
      return {
        getArticles,
        getTalks,
        getCourses,
        getInterviews
      }
    },
    components: { AppTitle }
  }
</script>

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
