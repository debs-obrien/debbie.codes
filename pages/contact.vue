<template>
  <div class="wrapper">
    <h1>Contact Me</h1>
    <p class="py-4">
      Hi send me a message if you want to get in touch
    </p>
    <form
      class="form"
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      action="/success"
    >
      <p class="hidden">
        <label>
          Don’t fill this out if you're human:
          <input name="bot-field" />
        </label>
      </p>
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

      <p class="flex justify-center">
        <button class="btn" type="submit">Send</button>
      </p>
    </form>
    <p>
      Twitter:
      <a href="https://twitter.com/debs_obrien">debs_obrien</a>
    </p>
    <p>
      LinkedIn:
      <a href="https://www.linkedin.com/in/debbie-o-brien-1a199975/">
        Debbie O'Brien
      </a>
    </p>
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
