<template>
  <div class="container">
    <div class="hero_texts text-center px-2">
      <div class="hero_image flex justify-center">
        <img
          class="rounded-full mb-4 mt-8 profile-pic border-white border"
          src="https://res.cloudinary.com/debsobrien/image/upload/c_fill,ar_1:1,g_auto,r_max,q_auto,f_auto/v1589119213/debbie.codes/home-pic_mfirod.jpg"
          alt="Debbie O'Brien"
        />
      </div>
      <h1 class="name dark:text-white uppercase mb-4">
        Debbie
        <span class="text-primary">O'Brien</span>
      </h1>

      <div class="dark:text-white subtitle font-medium">
        <p class="mb-4">
          Head of Learning & Developer Advocate at NuxtJS
        </p>
        <p>Microsoft MVP | GitHub Star | Google GDE | Cloudinary MDE</p>
      </div>
    </div>
  </div>
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
