<template>
  <form
    id="contact_form"
    name="contact"
    method="POST"
    data-netlify="true"
    netlify-honeypot="bot-field"
    action="/thank-you/"
    class="grid grid-cols-1 gap-y-6"
  >
    <input type="hidden" name="form-name" value="contact" />

    <p class="hidden">
      <label>
        Don’t fill this out if you're human:
        <input name="bot-field" />
      </label>
    </p>
    <div>
      <label for="full_name" class="sr-only">Full name</label>
      <input
        id="name"
        name="name"
        type="text"
        placeholder="Your Name"
        required
        autocomplete="name"
        class="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
      />
    </div>
    <!-- <div>
      //just testing
      <label for="email" class="sr-only">Email</label>
      <input
        id="email"
        name="email"
        placeholder="Your Email"
        required
        type="email"
        autocomplete="email"
        class="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
      />
    </div> -->

    <div>
      <label for="message" class="sr-only">Message</label>
      <textarea
        id="message"
        name="message"
        placeholder="Your Message"
        required
        rows="4"
        class="block w-full shadow-sm py-3 px-4 placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 border-gray-300 rounded-md"
      ></textarea>
    </div>
    <div class="flex justify-center">
      <BaseButton text="Send" />
    </div>
  </form>
</template>
