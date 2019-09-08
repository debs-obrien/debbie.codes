<template>
  <div class="wrapper">
    <h1>Contact Me</h1>
    <p class="py-4">
      Hi send me a message if you want to get in touch
    </p>
    <form
      class="form"
      name="contact"
      data-netlify-recaptcha="true"
      method="POST"
      data-netlify="true"
    >
      <p class="flex justify-between mb-4">
        <label>
          Your Name:
        </label>
        <input type="text" name="name" required />
      </p>
      <p class="flex justify-between mb-4">
        <label>
          Your Email:
        </label>
        <input type="email" name="email" required />
      </p>

      <p class="flex justify-between mb-4">
        <label>
          Message:
        </label>
        <textarea name="message" required></textarea>
      </p>
      <div data-netlify-recaptcha="true"></div>

      <p class="flex justify-center">
        <button class="btn" type="submit">Send</button>
      </p>
    </form>
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.wrapper {
  margin: 0 auto;
}
.form {
  max-width: 350px;
}
</style>
