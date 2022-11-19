---
title: Adding analytics to your Nuxt site
date: 2021-01-28
description: When you build your own site sometimes it's important to add analytics to see what is doing well, what your audience is spending time and perhaps find ways of improving your site
image: c_scale,fl_lossy,f_auto,q_auto,w_600/v1611841528/debbie.codes/plausible_laomvr
provider: cloudinary
tags: [nuxt]
---

I recently just added [Plausible](https://plausible.io/) to my personal Nuxt site. Although I am still running the free trial version I am pretty sure that I will pay the small monthly fee and keep using this for my analytics. Why? I know right. Google Analytics is free so why pay for a service? I never normally pay for anything when there is a free option but in this case I think it's worth it.

I have had Google Analytics on my site for months and I never once looked at it because to be honest I am just not too keen on their platform. I am sure it's great if you are into marketing but I just find it too much and I end up getting lost. I just want to know what my most visited page was or how well a page is doing. I want things to be just easy, to be simple but also to be nice on the eye.

## Easy to use

[Plausible](https://plausible.io/) gives you a really nice way of seeing your data. A simple url. You can keep this private or make it public and share it with the world which can be helpful for sharing projects across teams. So now I can just bookmark the url and open it when I want to see what is going on. ![plausible](https://res.cloudinary.com/debsobrien/image/upload/c_scale,fl_lossy,f_auto,q_auto,r_10,w_1200/v1611841528/debbie.codes/plausible_laomvr.png)

I never built my site for other people. I built it as my playground, my way to explore and play with new things in Nuxt and a way that I could learn. As it is a personal project I don't always have the time to invest in it to make it more amazing and as a developer we are never fully happy with our personal site. There is always something more we could be doing, always somethings else that could be better. My blog posts were really just ways for me to remember things, my learning journal, my notes. I never wrote a blog thinking about what other people wanted to read. I probably still don't to be honest. My blog is basically my way of getting information out of my head so that I can do more things but also have a place to go back to when I need to remember the thing I got out of my head.

## Why add Analytics?

When you add analytics to you site you can see that people are actually reading your posts and you think, perhaps I should do more of these. If my posts help make other peoples lives easier then I really should continue to do that. Finding time to create posts is never easy of course and I do find that having the right tools really helps. I don't want to spend too long writing posts. I just want to write in Markdown, add an image and publish. I use content module for that and I wrote a [tutorial](https://nuxtjs.org/blog/creating-blog-with-nuxt-content) on it which you can read here. If you haven't already created your blog then I highly recommend that you do.

## No more Cookie Banner

Another great thing about using [Plausible](https://plausible.io/) instead of Google Analytics is that your data is yours which means you are also protecting the privacy of your visitors. Your website data is never shared with advertising or marketing companies and no data is sent to third-parties and that means you don't need to have the annoying cookie banner on your site. I always hated my cookie banner which I needed to add for European laws as Google Analytics store cookies. It was such a pleasure to remove this from my site as to be honest not everyone likes cookies or being tracked so now I feel my site is just friendlier for my users. I

## Great for Performance

But by far the best thing about [Plausible](https://plausible.io/) is that it is lightweight meaning no more losing performance benefits by adding analytics to your site. Plausible is less than 1KB whereas Google Analytics was 17KB. Since removing Google Analytics I now have full scores on my site. ![light house full score](https://res.cloudinary.com/debsobrien/image/upload/c_scale,fl_lossy,f_auto,q_auto,r_10,w_1200/v1611841869/debbie.codes/performance_we5uhd.png)

## Open Source

And did you know that [Plausible](https://plausible.io/) is Open Source? It is built openly on GitHub and released under AGPL licence and can be self hosted too. I highly encourage you to give it a try, you might even like it.

## Adding Plausible to your Nuxt site

With Nuxt you can add Plausible to our site by installing the [Plausible module](https://github.com/moritzsternemann/vue-plausible).

```bash{}[]
yarn add vue-plausible
```

Then you need to add the `vue-plausible` module to the `modules` property in our Nuxt config.

```js{}[nuxt.config.js]
export default {
  modules: ['vue-plausible']
}
```

And finally you need to add the `domain` property with the value being your domain which in my case is `debbie.codes`.

```js{}[nuxt.config.js]
export default {
  plausible: {
    domain: 'ADD-YOUR-DOMAIN-HERE'
  }
}
```

## Plausible Dashboard

Of course in your Plausible dashboard you will need to add your domain and press the save button. You can then decide on your timezone, if to make your dashboard public and you can even integrate the Google Search Console.

If you really want to see your Analytics but don't have the time then you can have them emailed to you on a weekly basis or even when you get a traffic spike so you can see what is going on at the right time so you can tweet about it and share it with the world.
