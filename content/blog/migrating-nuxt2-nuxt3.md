---
title: Migrating from Nuxt 2 to Nuxt 3
date: 2022-11-23
description: My personal website was built many years ago and had collected quite a large amount of code as I used my site to play around and experiment new features of Nuxt. It took me ages to finally decide to migrate cause lets face it, we all hate migrations. But I finally did it and I'm so glad I did. I'm going to share with you the steps I took to migrate my site from Nuxt 2 to Nuxt 3.
image: v1640965793/debbie.codes/blog/devs-in-the-forest_c_gctzoz.jpg
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1640965793/debbie.codes/blog/devs-in-the-forest_c_gctzoz.jpg
provider: cloudinary
tags: [nuxt]
published: false
---

My personal website was built many years ago and had collected quite a large amount of code as I used my site to play around and experiment new features of Nuxt. It took me ages to finally decide to migrate cause lets face it, we all hate migrations. But I finally did it and I'm so glad I did. I'm going to share with you the steps I took to migrate my site from Nuxt 2 to Nuxt 3.

When I first stared the migration I decided to update my package.json and install Nuxt 3 and try to fix error by error. But this didn't work out too well. There were too many and I couldn't figure out which module was causing the error or if it was something else. So I decided to start from scratch and copy over my code. This worked out much better.

## Starting from Scratch

Now starting from scratch sounds very scary indeed. Like a lot of work and time but actually it wasn't and it proved to be the better method for migration. I created a new branch from the main branch so it included all my code. I then created a folder called "__nuxt2" and copied all my code into it. I now had no files or folders at root level except the nuxt2 folder. I then started a new Nuxt project following the instructions from the docs. This gave me a very basic Nuxt 3 project and somewhere to start from.

```bash
npx nuxi init nuxt-app
```

This command creates a minimal Nuxt app inside a folder called nuxt-app. I then just moved these to root level and deleted the folder. Then I installed the dependencies and started the dev server.

```bash
npm install
```

```bash
npm run dev
```

## What's different?

I took a look at what had been installed to understand the differences between Nuxt 2 and Nuxt 3. Nuxt 3 is much more stripped back than Nuxt 2 with the idea of adding the folders you need rather than having everything and activating them by putting a file inside. This means by default Nuxt 3 is much smaller and doesn't include the router by default. That also means there is no pages folder by default. By adding the pages folder and putting a file inside it will create the router for you. If you only have one page, for example a landing page then you may not need a pages folder.

The `app.vue` file is the root of your application and Nuxt renders its contents for every route of the application. You will notice this page comes with a Welcome component that is built into Nuxt meaning you won't find it in the components folder. The first thing I did was remove this component and add my name in a `<h1>` tag. Once I saw this worked I now knew I needed to add a way to render each page. This is done with the built in `<NuxtPage />` component.

```html 
<template>
  <div>
    <NuxtPage />
  </div>
</template>
```

## Adding the pages folder

Now in order to see something rendered I needed to create a pages folder and a file called index.vue. I then added the following code to the file. Inside this file I could add my name and test out that it worked.

```html
<template>
  <h1>Debbie</h1>
<template>
```

And it worked! I now had my name rendered on the page. I then added a second page called `about.vue` and added some text. I checked routing was working by adding 'about' at the end of `http://localhost:3000/` in the browser url. This has always been one of my favourite features of Nuxt.

## Adding content to the index page

I decided to focus on adding all content to the index page as this page contained many components and also was using Nuxt content to fetch data from my markdown files. First thing I did was copy the contents of my index file from the Nuxt 2 folder into my new index file. I simplified things by commenting out anything in the `<script>` tag and any components that relied on the Nuxt Content Module such as the blog post cards and video cards etc. This left me with a very basic page with just text rendered with no formatting and broken images.


## Adding the Nuxt Content Module

I decided to work on getting content working first as all my content comes from the Nuxt content module. I first copied the content folder from my nuxt 2 folder and pasted it at root level. I then [installed the Nuxt Content Module](https://content.nuxtjs.org/get-started#add-to-a-project). 

```bash
npm install --save-dev @nuxt/content
```

I then added it to the modules array in the `nuxt.config.js` file. 

```js
import { defineNuxtConfig } from 'nuxt'

export default defineNuxtConfig({
  modules: [
    '@nuxt/content'
  ],
})
```

Next step was to query some content. There are a few difference between Nuxt content version 1 and version 2 when it comes to querying data. Fetch has changed to `find()` and `queryContent` composable instead of the `$content` variable. I suggest taking a look at the [Nuxt Content API docs](https://content.nuxtjs.org/api/composables/query-content) to see examples of using `queryContent`.

I stared out with a stripped back version of my query in order to just see some data rendered. In my content folder I previously had a folder called articles which I renamed to blog as blog is used as the root path.

```js
const articles = await queryContent('blog').find()
```
Then in the template I added a `<pre>` tag to render the data.

```html
<template>
  <pre>{{ articles }}</pre>
</template>
```

Once I saw I had some data back I then improved the query to only get back the data I needed. The sort is a little bit different than before but the rest was the same.

```js
const articles = await queryContent('blog')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(6)
  .find()
```

I now had just the data from the `yaml` part of my markdown files so I uncommented out the rest of my queries changing the `$content` variable to `queryContent` and `fetch` to `find` and fixing the date. 

```js
const podcasts = await queryContent('podcasts')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(3)
  .find()

const videos = await queryContent('videos')
  .where({ published: { $ne: false } })
  .without('body')
  .sort({ date: -1 })
  .limit(5)
  .find()
```
I then added a `<pre>` tag to render each query.

```html
<template>
  <pre>{{ articles }}</pre>
  <pre>{{ podcasts }}</pre>
  <pre>{{ videos }}</pre>
</template>
```
## Adding the components

Next step was to add the components so that they could be rendered correctly. I copied over only the components I needed from my Nuxt 2 folder starting with the BlogPostCard component, VideoCard component and PodcastCard component. I then uncommented out the components from the `index.vue` file and removed the `<pre>` tags. Things now looked a little tidier on the page but were still super ugly. I also had some title components which I copied to the components folder and then uncommented out the code so they could also be rendered.

The great thing about Nuxt 3 is that once I add a component to the components folder I can just use it directly in any of my pages without having to import it or add any module. It just works.

## Adding the styling

I now had a super ugly page with all the content rendered but it was time to add some styling. I first created an `assets` folder and then copied over the `main.css` file from my Nuxt 2 folder. I then copied over my `tailwind.config.js` file and installed Tailwind.

```bash
npm i -D @nuxtjs/tailwindcss
```

Next I added the `@nuxtjs/tailwindcss` module to the `nuxt.config.js` file as well as the css array with the path to my `main.css` file.


```js
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ],
  css: [
    '~/assets/css/main.css',
  ],
})
```

I now had all styles working and the home page was looking pretty good indeed.

## Adding the Nuxt Image Module

In order to render the images I had previously been using the Nuxt Image Module so I needed to install it. 

```bash
npm i -D @nuxt/image-edge
```

Once installed I added it to the modules array in the `nuxt.config.js` file as well as copy over my configuration for the module from my `nuxt.config` file from my Nuxt 2 folder. Ths included adding my cloudinary baseURL and imgix baseURL as these were the two cloud providers I was using.


```js
export default defineNuxtConfig({
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
  ],
  css: [
    '~/assets/css/main.css',
  ],
  image: {
    cloudinary: {
      baseURL: 'https://res.cloudinary.com/debsobrien/image/upload/',
    },
    imgix: {
      baseURL: 'https://images.unsplash.com/',
    },
  },
})
```
I now had images rendered and a pretty good looking home page. Next step was to add the header and footer components to have a complete looking page even though I had not finished 
