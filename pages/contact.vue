<template>
  <div class="container">
    <div class="text-center">
      <h1 class="main-heading">Get in Touch</h1>
    </div>
    <div class="mt-20 flex flex-col md:flex-row">
      <div class="w-full md:w-2/5 mb-10">
        <ul>
          <li class="mb-2">
            <a class="href_location" href="#">
              Palma de Mallorca, Spain
            </a>
          </li>
          <li class="mb-2">
            <a href="mailto:debs_obrien@yahoo.co.uk">
              debs_obrien@yahoo.co.uk
            </a>
          </li>

          <li class="mb-2">
            <a href="https://twitter.com/debs_obrien">
              Twitter: debs_obrien
            </a>
          </li>
          <li>
            <a href="https://www.linkedin.com/in/debbie-o-brien-1a199975/">
              LinkedIn: debbie-o-brien
            </a>
          </li>
          <li>
            <a href="https://noti.st/debbie">
              Speaker Profile: noti.st/debbie
            </a>
          </li>
          <li>
            <a href="https://github.com/debs-obrien">
              Github: debs-obrien
            </a>
          </li>
        </ul>
      </div>
      <div class="w-full md:w-3/5 md:ml-8">
        <form
          id="contact_form"
          name="contact"
          method="POST"
          data-netlify="true"
          netlify-honeypot="bot-field"
          action="/thank-you/"
          class="w-full"
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
              />
            </li>
            <li class="w-full md:w-1/2 mb-10">
              <input
                id="email"
                name="email"
                type="text"
                placeholder="Your Email"
                required
              />
            </li>
            <li class="w-full">
              <textarea
                id="message"
                name="message"
                placeholder="Your Message"
                required
              ></textarea>
            </li>
          </ul>

          <button class="flex justify-start grax_button" type="submit">
            Send
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
input,
textarea {
  background-color: transparent;
  border: none;
  border-bottom: 1px solid #333;
  width: 100%;
  padding: 0 20px 0 0;
  color: #333;
  transition: all 0.3s ease;
}
</style>
