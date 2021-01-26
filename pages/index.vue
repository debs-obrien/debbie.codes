<template>
  <div class="container">
    <div class="hero_texts text-center px-2">
      <div class="hero_image flex justify-center">
        <img
          class="rounded-full mb-4 mt-8 profile-pic border-white border"
          src="https://res.cloudinary.com/debsobrien/image/upload/c_fill,ar_1:1,g_auto,r_max,q_auto,f_auto/v1589119213/debbie.codes/home-pic_mfirod.jpg"
          alt="Debbie O'Brien"
          width="180"
          height="180"
        />
      </div>
      <h1 class="name dark:text-white uppercase mb-4">
        Debbie
        <span class="text-primary">O'Brien</span>
      </h1>

      <div class="dark:text-white subtitle font-medium mb-20">
        <p class="mb-4">
          Head of Learning & Developer Advocate at NuxtJS
        </p>
        <p>
          <a
            href="https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Microsoft MVP
          </a>

          |
          <a
            href="https://stars.github.com/profiles/debs-obrien/"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            GitHub Star
          </a>
          |
          <a
            href="https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Google GDE
          </a>
          |
          <a
            href="https://cloudinary.com/mde"
            target="_blank"
            rel="nofollow noopener noreferrer"
          >
            Cloudinary MDE
          </a>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    layout: 'home',
    colorMode: 'dark'
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
