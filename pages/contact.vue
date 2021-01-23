<template>
  <div class="container">
    <AppTitle>Contact Me</AppTitle>
    <AppIntro>
      Hey there. If you are looking to reach out to me you can use this form
      although in general you will probably reach me quicker on Twitter or
      LinkedIn.
    </AppIntro>
    <TheContactForm class="w-2/3 mx-auto pt-16" />
  </div>
</template>
<script>
  export default {
    data() {
      return {
        title: 'Contact Debbie',
        description: 'Contact Debbie using the form or via Twitter or LinkedIn'
      }
    },

    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'desctiption',
            content: this.desctiption
          }
        ],
        link: [
          {
            hid: 'canonical',
            rel: 'canonical',
            href: `https://debbie.codes/contact`
          }
        ]
      }
    }
  }
</script>
