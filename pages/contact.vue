<template>
  <div class="container">
    <div class="text-center">
      <h1 class="main-heading">
        {{ page.title }}
      </h1>
    </div>
    <div class="w-full flex flex-col justify-center md:ml-8">
      <p class="w-1/2 mb-12 self-center">
        Hey there. If you are looking to reach out to me you can use this form
        although in general you will probably reach me quicker on Twitter or
        LinkedIn. If you like the YouTube videos I am creating then feel free to
        like them or leave a comment especially if you have any suggestions for
        future content.
      </p>
      <form
        id="contact_form"
        name="contact"
        method="POST"
        data-netlify="true"
        netlify-honeypot="bot-field"
        action="/thank-you/"
        class="w-1/2 self-center"
      >
        <input type="hidden" name="form-name" value="contact" />

        <p class="hidden">
          <label>
            Don’t fill this out if you're human:
            <input name="bot-field" />
          </label>
        </p>

        <ul class="mb-10">
          <li class="w-full md:w-1/2 mb-10">
            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your Name"
              required
              class="bg-transparent border-b border-secondary pr-2 text-secondary dark:text-white"
            />
          </li>
          <li class="w-full md:w-1/2 mb-10">
            <input
              id="email"
              name="email"
              type="text"
              placeholder="Your Email"
              required
              class="bg-transparent border-b border-secondary pr-2 text-secondary dark:text-white"
            />
          </li>
          <li class="w-full">
            <textarea
              id="message"
              name="message"
              placeholder="Your Message"
              required
              class="bg-transparent border-b border-secondary pr-2 w-full text-secondary dark:text-white"
            />
          </li>
        </ul>
        <BaseButton text="Send" />
      </form>
    </div>
  </div>
</template>
<script>
  export default {
    async asyncData({ $content }) {
      const page = await $content('contact').fetch()
      return {
        page
      }
    }
  }
</script>

<style scoped>
  input,
  textarea {
    transition: all 0.3s ease;
  }
</style>
