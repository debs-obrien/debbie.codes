<template>
  <div class="container">
    <div class="flex">
      <div class="hidden md:block md:w-2/5">
        <img
          src="https://res.cloudinary.com/debsobrien/image/upload/v1579977198/ME/debbie-mvp_gcgsof.png"
          alt="Debbie O'Brien - Microsoft Most Valuable Professional"
        >
      </div>
      <div class="w-full md:w-3/5 ml-8">
        <nuxt-content :document="page" />

        <div class="flex w-full mb-16">
          <BaseLink href="/contact" text="Send Message" />
        </div>

        <div class="flex flex-wrap justify-between">
          <img
            class="mb-4"
            src="https://res.cloudinary.com/debsobrien/image/upload/c_scale,h_230/v1587830943/debbie.codes/gd_experts_lockup_vertical_color_zrxail.jpg"
            alt="Google Developer Expert"
          >
          <img
            class="block md:hidden mb-4"
            src="https://res.cloudinary.com/debsobrien/image/upload/c_fit,h_160/v1579977213/ME/mvp_o5w23e.png"
            alt="Microsoft Most Valuable Professional"
          >
          <img
            class="mb-4"
            src="https://res.cloudinary.com/debsobrien/image/upload/c_scale,h_230/v1587830473/debbie.codes/MDE_Abbrev_Logo_Dark-01_eyrfp5.png"
            alt="Cloudinary Media Developer Expert"
          >
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import BaseLink from '@/components/BaseLink'
export default {
  components: {
    BaseLink
  },

  async asyncData ({ $content }) {
    const page = await $content('about').fetch()
    return {
      page
    }
  }
}
</script>
