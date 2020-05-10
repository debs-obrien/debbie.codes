<template>
  <div class="container">
    <div class="hero_texts text-center px-2 ">
      <div class="hero_image flex justify-center">
        <img
          class="rounded-full mb-4 mt-8"
          src="https://res.cloudinary.com/debsobrien/image/upload/w_180,c_fill,ar_1:1,g_auto,r_max/v1585999127/ME/_VZR8123_ix7vu3.jpg"
          alt="Debbie O'Brien"
        />
      </div>
      <h3 class="name dark:text-white uppercase mb-4">
        Debbie
        <span class="text-primary">O'Brien</span>
      </h3>

      <div class="dark:text-white subtitle font-medium">
        <p class="mb-4">
          Head of Learning & Developer Advocate at NuxtJS
        </p>

        <p>Microsoft MVP | Google GDE | Cloudinary MDE</p>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'home',
  transition: 'fade',
  components: {}
}
</script>
<style scoped>
.hero_texts .subtitle {
  font-size: 22px;
}

.hero_texts .name {
  font-size: 75px;
}

@media (max-width: 768px) {
  .hero_texts .name {
    font-size: 50px;
  }
}
</style>
