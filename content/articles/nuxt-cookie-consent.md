---
title: Adding a cookie consent banner
date: 2020-07-29
description: When in Europe and using cookies we need to show a cookie consent banner so our users are aware that we are using cookies on the site.
image: https://images.unsplash.com/photo-1558961363-fa8fdf82db35?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [Nuxt]
---

When in Europe and using cookies we need to show a cookie consent banner so our users are aware that we are using cookies on the site.

To add a cookie banner to your Nuxt.js application you can use the [vue-cookieconsent-component](https://github.com/EvodiaAut/vue-cookieconsent-component)

```bash
yarn add vue-cookieconsent-component
```

We then create a cookie box component with the props of message and link-label.

```html{}[CookieBox.vue]
<template>
  <CookieConsent
    message="We use Cookies for user analysis and on-page improvements!"
    link-label="Learn about cookies"
  />
</template>
```

And we then import our CookieConsent component.

```html{}[CookieBox.vue]
<script>
  import CookieConsent from 'vue-cookieconsent-component/src/components/CookieConsent.vue'

  export default {
    components: {
      CookieConsent
    }
  }
</script>
```

We then add the styles so it looks how we want it to, positioned at the top or bottom of the page.

```html{}[CookieBox.vue]
<style>
  .cookie-consent {
    display: flex;
    padding: 10px;
    align-items: center;
    align-self: center;
    justify-content: center;
    border-bottom: 1px solid white;
    color: white;
  }
  .cookie-consent button {
    border: 1px solid white;
    padding: 10px;
    margin-left: 20px;
    min-width: 140px;
  }
</style>
```

We can also add a package called [VueIfBot](https://github.com/Developmint/vue-if-bot#readme) which will hide your cookie consent for search engine crawlers.

```bash
yarn add vue-if-bot
```

We then wrap our CookieConsent component in the IfBot component.

```html{}[CookieBox.vue]
<template>
  <VueIfBot>
    <CookieConsent
      message="We use Cookies for user analysis and on-page improvements!"
      link-label="Learn about cookies"
    />
  </VueIfBot>
</template>
```

Or you could create your own content

```html
<cookie-consent>
  <template slot="message">
    This website uses cookies
    <a class="btn btn-link" href="/my-cookies">Read more</a>
  </template>
  <template slot="button">
    <button class="btn btn-info">Accept</button>
  </template>
</cookie-consent>
```

And of course we must import it in our script tag

```html{}[CookieBox.vue]
<script>
  import VueIfBot from 'vue-if-bot/dist/vue-if-bot.es'
  import CookieConsent from 'vue-cookieconsent-component/src/components/CookieConsent.vue'

  export default {
    components: {
      VueIfBot,
      CookieConsent
    }
  }
</script>
```

We can then add our component to our header or footer or wherever we want to place it.

```html{}[TheFooter.vue]
<footer>
  <TheCookieBox />
</footer>
```

And that's it. we now have a cookie consent banner on our site
