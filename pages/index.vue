<template>
  <div class="home">
    <div class="grax_hero_wrap">
      <div class="container">
        <div class="hero_texts text-center fixed z-0 px-2">
          <div class="hero_image flex justify-center">
            <img
              class="rounded-full"
              src="https://res.cloudinary.com/debsobrien/image/upload/w_180,c_fill,ar_1:1,g_auto,r_max/v1579977185/ME/debbie-MVP_pprwcg.jpg"
              alt="Debbie O'Brien"
            />
          </div>
          <h3 class="name text-white uppercase mb-4">
            Debbie
            <span class="text-primary">O'Brien</span>
          </h3>
          <div class="text-white subtitle font-medium">
            Microsoft MVP, Google GDE and Cloudinary MDE.
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  layout: 'home',
}
</script>
<style scoped>
.home {
  background: black;
  height: 100vh;
  display: flex;
}

.hero_texts {
  width: 100%;
  opacity: 1;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

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
