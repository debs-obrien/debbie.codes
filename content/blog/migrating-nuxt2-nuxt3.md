---
title: Migrating from Nuxt 2 to Nuxt 3
date: 2022-11-27
description: My personal website was built many years ago and had collected quite a large amount of code as I used my site to play around and experiment new features of Nuxt. It took me ages to finally decide to migrate cause lets face it, we all hate migrations. But I finally did it and I'm so glad I did. I'm going to share with you the steps I took to migrate my site from Nuxt 2 to Nuxt 3.
image: v1640965793/debbie.codes/blog/2022/nuxt3_q10xtr.png
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1640965793/debbie.codes/blog/2022/nuxt3_q10xtr.png
provider: cloudinary
tags: [nuxt]
published: true
---

My personal website was built many years ago and had collected quite a large amount of code as I used my site to play around and experiment new features of Nuxt. It took me ages to finally decide to migrate cause lets face it, we all hate migrations. But I finally did it and I'm so glad I did. I'm going to share with you the steps I took to migrate my site from Nuxt 2 to Nuxt 3. My website is open source so feel free to [check out my repo or clone it](https://github.com/debs-obrien/debbie.codes).

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

And it worked! I now had my name rendered on the page. I then added a second page called `about.vue` and added some text. I checked routing was working by adding 'about' at the end of `http://localhost:3000/about` in the browser url. This has always been one of my favourite features of Nuxt. No need to setup or understand how routing works. You just have to add `.vue` files to the pages folder and thats it.
## Adding content

I decided to focus on adding all content to the index page as this page contained many components and also was using Nuxt content to fetch data from my markdown files. First thing I did was copy the contents of my index file from the Nuxt 2 folder into my new index file. I simplified things by commenting out anything in the `<script>` tag and any components that relied on the Nuxt Content Module such as the blog post cards and video cards etc. This left me with a very basic page with just text rendered with no formatting and broken images.

## Nuxt Content Module

I decided to work on getting content rendered first. All my content comes from markdown files which are located in a content folder. The Nuxt content module works like a git based CMS making it really easy to write blog posts in markdown or use yaml to create content for video or podcast cards and easily render them throughout the site. The module has a great feature for querying so you can get back only what you need just like if it were stored in a database. I started by copying the content folder from my nuxt 2 folder and pasted it at root level of. I then [installed the Nuxt Content Module](https://content.nuxtjs.org/get-started#add-to-a-project). 

```bash
npm install -D @nuxt/content
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

Next step was to query some content. There are a few differences between Nuxt content version 1 and version 2 when it comes to querying data. Fetch has changed to `find()` and `queryContent` composable instead of the `$content` variable. I suggest taking a look at the [Nuxt Content docs](https://content.nuxtjs.org/guide/displaying/querying) to see examples of using `queryContent`.

I stared out with a stripped back version of my query in order to just see some data rendered. In my content folder I previously had a folder called articles which I renamed to blog as blog is used as the root path.

```js
const { data: articles } = await useAsyncData('articles',
  () => queryContent('blog')
    .find()
)
```
Then in the template I added a `<pre>` tag to render the data.

```html
<template>
  <pre>{{ articles }}</pre>
</template>
```

Once I saw I had some data back I then improved the query to only get back the data I needed. The `sort` is a little bit different than before and of course the `find` instead of `fetch` but the rest was the same. Also make sure you add a key as the first argument to the `useAsyncData` function.

```js
const { data: articles } = await useAsyncData('articles',
  () => queryContent('blog')
    .where({ published: { $ne: false } })
    .without('body')
    .skip(1)
    .sort({ date: -1 })
    .limit(6)
    .find()
)
```

I now had just the data from the `yaml` part of my markdown files so I uncommented out the rest of my queries changing the `$content` variable to `queryContent` and `fetch` to `find` and fixing the date. 

```js
const { data: videos } = await useAsyncData('videos',
  () => queryContent('videos')
    .where({ published: { $ne: false } })
    .without('body')
    .sort({ date: -1 })
    .limit(4)
    .find()
)

const { data: podcasts } = await useAsyncData('podcasts',
  () => queryContent('podcasts')
    .where({ published: { $ne: false } })
    .without('body')
    .sort({ date: -1 })
    .limit(3)
    .find()
)
```
I then added a `<pre>` tag to render each query.

```html
<template>
  <pre>{{ articles }}</pre>
  <pre>{{ podcasts }}</pre>
  <pre>{{ videos }}</pre>
</template>
```

## Adding components

Next step was to add the components so that they could be rendered correctly. I copied over only the components I needed from my Nuxt 2 folder starting with the BlogPostCard component, VideoCard component and PodcastCard component. I then uncommented out the components from the `index.vue` file and removed the `<pre>` tags. Things now looked a little tidier on the page but were still super ugly as I had no styling added yet. I also had some title components which I copied to the components folder and then uncommented out the code so they could also be rendered.

>The great thing about Nuxt 3 is that once I add a component to the components folder I can just use it directly in any of my pages without having to import it or add any module. It just works thanks to [Nuxt's auto imports](https://nuxt.com/docs/guide/concepts/auto-imports).

## Adding styling

I now had a super ugly page with all the content rendered but it was time to add some styling. I first created an `assets` folder and then copied over the `main.css` file from my Nuxt 2 folder. I then copied over my `tailwind.config.js` file and installed [Tailwind](https://tailwindcss.com/).

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

## Nuxt Image Module

In order to render the images I had previously been using the [Nuxt Image Module](https://image.nuxtjs.org/) for [enhanced performance](/blog/nuxt-image) so I needed to install it. This module is still on the edge version but it seems to work just fine.

```bash
npm i -D @nuxt/image-edge
```

Once installed I added it to the modules array in the `nuxt.config.js` file and copied my configuration for the module from my `nuxt.config` file in my Nuxt 2 folder. Ths included adding my cloudinary baseURL and imgix baseURL as these were the two cloud providers I was using.


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

## Header and Footer

I now had images rendered and a pretty good looking home page. Next step was to add the header and footer components to have a complete looking page. I started by copying the header, footer and Navigation component into my Nuxt 3 folder and then uncommenting them on the home page. As mentioned before adding components to the components folder makes them available on any page with no need to import them in your file and no module needed as it's built in to Nuxt 3.

 The header component was pretty straight forward but the footer component included svgs that were using a module. I decided to not use the svg module for now and just convert my social icons into Vue components and add them to an Icon folder inside the components folder. I could then just use these icon components like any other vue component.

## Pages and dynamic routes

The home page was pretty much complete but none of the links in the Navigation worked as I didn't have any pages yet in my pages folder except the about page I previously created. Nuxt does all the work for you when it comes to routing so the only thing you have to do is add the pages into the pages folder. I copied over the missing pages for the blog, podcasts and videos etc. As these pages all query the content folder I refactored the query to use Convent v2 just like I had done on the home page. 

The main difference was dynamic pages. This had changed and now the dynamic page is wrapped in square brackets, `[slug].vue` instead of the `_slug.vue`. I took this opportunity to refactor the way I was handing the blog categories and remove pagination in favour of adding more categories and improving the filtering. This was done by creating a `[slug].vue` page in a tags folder so that I could have a page for each tag such as a page for 'nuxt', 'testing' etc. I also added all videos into one content folder called videos and added categories and the tags component to all other similar pages.


When working with params in Nuxt 3 we have a `useRoute()` composeable. For the data call make sure you add a unique key to your `useAsyncData()` so that the change in slug changes the value of the call. This gets passed in as the first argument to the `useAsyncData()` function.

```js
const {
  params: { slug },
} = useRoute()

const { data: articles } = await useAsyncData(`articles-${slug}`,
  () => queryContent<BlogPost>('blog')
    .where({ published: { $ne: false }, tags: { $contains: slug } })
    .sort({ date: -1 })
    .find(),
)
```

## Rendering markdown content

There were also some small difference when rending the blog page and there is now a new component to render the markdown content called [`ContentRenderer`](https://content.nuxtjs.org/guide/displaying/rendering#contentrenderer-) passing in your data into the `value` prop.

```html
<ContentRenderer :value="article">
  <template #empty>
    <p>No content found.</p>
  </template>
</ContentRenderer>
```

## Styling the blog page

To easily style the main blog article I used the `@tailwindcss/typography` module just like before. I first installed it.

```bash
npm i -D @tailwindcss/typography
```

I Then added the module to the `nuxt.config.js` file.

```js
export default defineNuxtConfig({
...
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@tailwindcss/typography',
    '@nuxtjs/color-mode',
  ],
  ...
```

I already had this plugin added to my plugins array in the `tailwind.config.js` file as I had copied over the whole config file and was previously using this module for styling markdown content.

```js
module.exports = {
  ..
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
``` 

For syntax highlighting of the codeblocks I added the `material-palenight` theme by adding the theme to the `content` object in the `nuxt.config.js` file.

```js
export default defineNuxtConfig({
...
 content: {
    highlight: {
      theme: {
        default: 'material-palenight',
      },
    },
  },
``` 

The blog page now looked pretty good although I did make some extra changes to it and improved the previous and next component as well as adding the table of contents component and a better heading for the page complete with an image and tags.

## Youtube lite plugin

My videos were all using the [youtube lite plugin](/blog/nuxt-lite-youtube-embeds) which enhances performance when loading lots of youtube videos. In order to get this working I first needed to install the npm package.

```bash
npm i -D lite-youtube-embed
```

I then created a plugins folder and added the youtube lite plugin to it.

```js
import 'lite-youtube-embed'
export default defineNuxtPlugin(() => {})
```

In Nuxt 3 plugins are automatically imported which is very cool indeed, so I didn't have to add it to the `nuxt.config.js` file. However I did need to add the CSS for the plugin to the css array in the config.

```js
export default defineNuxtConfig({
  ...
  css: [
    '~/assets/css/main.css',
    '~/node_modules/lite-youtube-embed/src/lite-yt-embed.css',
  ],
  ...
}
```

## Color mode module

The color module had changed a little from Nuxt 2 to Nuxt 3. I started by first installing the module.

```bash
npm i -D @nuxtjs/color-mode
```

I then added the module to the `nuxt.config.js` file and added the configuration for the module. This consisted of adding the `colorMode` object with the `classSuffix`, `preference` and `fallback` properties. 


```js
export default defineNuxtConfig({
...
  modules: [
    '@nuxt/image-edge',
    '@nuxtjs/tailwindcss',
    '@nuxt/content',
    '@tailwindcss/typography',
    '@nuxtjs/color-mode',
  ],
  colorMode: {
    classSuffix: '',
    preference: 'system', // default value of $colorMode.preference
    fallback: 'dark',
  },
  ...
```

For the component itself there was some slight refactoring to do adding the `useColorMode()` composable instead of the method. I also decided to use TypeScript and therefore added the type of Theme to be either light or dark. Previously I also had a sepia theme but decided not to keep maintaining it.

```js
<script setup lang="ts">
type Theme = 'light' | 'dark'
const setColorTheme = (newTheme: Theme) => {
  useColorMode().preference = newTheme
}
</script>
```

## Options to composition 

All my code worked and my site was pretty much finished and ready to deploy. However I wanted to improve things and learn more about the composition API and what was different. So I started to refactor my code starting by adding `setup` to the `<script>` tag.

```js
<script setup>
...
</script>
```

### Props

Previously for props we needed to add an export default and add props to the props object.

```js
<script>
  export default {
    props: {
      list
    },
  }
</script>
```

In Vue 3 we can use `defineProps` instead.

```js
<script setup>
defineProps<{
  list
}>()
</script>
```

### Methods

I was previously setting the data of `isOpen` to false and then using a method with a `toggle()` function to change the value of the data from true to false.

```js
<script>
  export default {
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen
      }
    }
  }
</script>
```
I refactored this to use `refs` passing in the initial value of false and toggling this value when the toggle is called. You can see how much cleaner the code looks from the previous version.

```js
<script setup>
const isOpen = ref(false)

const toggle = () => {
  isOpen.value = !isOpen.value
}
</script>
```

## Composeables

I was rendering the date on my blog posts, videos and podcasts and this method was being used in multiple places. 

```js
<script>
  export default {
    methods: {
      formatDate(date) {
        const options = { year: 'numeric', month: 'long', day: 'numeric' }
        return new Date(date).toLocaleDateString('en', options)
      }
    }
  }
</script>
```

I decided to refactor this into a composable and use it in all the places I needed it. I created a new folder called `composables` and added a new file called `utils.ts` 

```js
export function formatDate(string) {
  const options = { year: 'numeric', month: 'long', day: 'numeric' }
  const date = new Date(string).toLocaleDateString('en-US', options)
  return date
}
```
[Composeables in Nuxt 3](https://nuxt.com/docs/guide/directory-structure/composables) are amazing. I could now use this composable in any of my components without importing it thanks to auto imports. Meaning I could just use `formatDate(date)` in any of my components or pages. This makes your code much more manageable and reusable.

## Constants

My navigation links were being used in multiple places and I wanted to refactor this into a constant. This meant I could have the list of links in one place and import them into the components where I needed them such as the Navigation component which contained the main navigation and the Footer component which had the same links but a different style and was not using the `<nav>` element. I created a `navigation.ts` file in a folder called `constants` added the links. I could then import `NavLinks` into the components where I needed them. This is not a Nuxt 3 feature, just something I did to keep code more maintainable.

```js
export const NavLinks = [
  {
    url: '/about',
    link: 'About',
  },
  {
    url: '/videos',
    link: 'Videos',
  },
  {
    url: '/podcasts',
    link: 'Podcasts',
  },
  {
    url: '/courses',
    link: 'Courses',
  },
  {
    url: '/blog',
    link: 'Blog',
  },
]
```
## TypeScript

I really wanted to make use of the fact that Nuxt 3 is TypeScript first and I wanted to learn more about TypeScript as I am certainly no expert. It is not exactly easy to get started as the Nuxt docs do not give a lot of TypeScrip examples but I am sure with time these will be improved. 

I started by adding the `lang="ts"` to the `<script>` tag of one of the components. This meant I could now use TypeScript in this component. The great thing about this is that I could refactor one by one taking my time to make sure I knew what I was doing for each component.

```ts
<script setup lang="ts">
  ...
</script>
```

### Types file

Instead of adding types to my props direct in the component I created a `types.ts` file and added my types here. 

```js
export type Sections = 'blog' | 'podcasts' | 'videos' | 'courses'
```
This meant I could then import the types and use them in various components.

```ts
<script setup lang="ts">
import type { Sections } from '~/types'
defineProps<{
  section: Sections
}>()
</script>
```

### Types for nuxt content

The props for my content coming form Nuxt content was a little more complex. I had to import `ParsedContent` from `@nuxt/content` and then add the type to the props I was using for my blog post.


```ts
import type { ParsedContent } from '@nuxt/content/dist/runtime/types'
export type Sections = 'blog' | 'podcasts' | 'videos' | 'courses'

export interface BlogPost extends ParsedContent {
  title: string
  date: string
  description: string
  url?: string
  image: string
  alt: string
  ogImage?: string
  provider: string
  tags: string[]
  published?: boolean
}
```

I could then import this type and use it in pages or components.

```ts
<script setup lang="ts">
import type { BlogPost } from '~/types'

const { data: articles } = await useAsyncData(`articles-${slug}`
  () => queryContent<BlogPost>('blog')
    .where({ published: { $ne: false } })
    .sort({ date: -1 })
    .find(),
)
```
### Omiting types

For the preview components where I omit the body tag I created a type called `BlogPostPreview` and used the `Omit` type to omit the body tag from the `BlogPost` type.


```ts
export type BlogPostPreview = Omit<BlogPost, 'body'>
```

Then in my component I could import this type and use it in the props.

```ts
<script setup lang="ts">
import type { BlogPostPreview } from '~/types'

defineProps<{
  item: BlogPostPreview
}>()
</script>
```

## Conclusion

I am still unsure if what I am doing here is entirely correct. All TypeScript errors have gone which is great but if this is the correct way of doing things or not I really don't know and there are not much docs to go by. Sometimes hovering over the the props for my articles gives me the type of `any` even though I have defined types so I am not sure if this is an issue with the content module or my lack of knowledge of TypeScript. If anyone else has added types for Nuxt content I would love to hear your feedback.

Either way. Even though it is not perfect I am pretty happy with having moved everything to TypeScript. I don't feel it is that difficult and it ensures I am using the correct types for my props and data and helps me find errors quicker.

Overall I am really happy with the progress I have made with Nuxt 3. I am still learning and I am sure there are many things I can improve on and there are still lots more features I can explore. Send me a pr or DM me if you see anything that needs improving. All feedback is welcome.

>I am really excited to finally see the release of Nuxt 3. I know how much work has gone into it and I really think the team have done an amazing job.  

### Community thanks

Special thanks to members of the community who pointed out that my site wasn't working as it should when I wasn't using `useAsyncData()` for querying my content and [Josh Deltner](https://twitter.com/JoshDeltener) for pointing out that my site had no favicon because I completely forget to copy over the `static` folder. Note this is now called the `public` folder in Nuxt 3. And of course [Daniel Roe](https://twitter.com/danielcroe) for answering my constant queries on migration, TypeScript and more.

Also the [movies repo](https://github.com/nuxt/movies) was a great reference for me to see how the Nuxt team have implemented Nuxt 3. I highly recommend checking it out.

### Other things not covered

Other things I didn't cover in this post were `useHead` for meta data which has changed and you can see an example in the `app.vue` file although I may revert to adding this back to the `nuxt.config` file instead. 

Also the 404 page is now created by adding a `[...slug].vue` file in the pages folder. This will then catch all routes that are not found and render what is inside this file instead.

Also I added testing with [Playwright](https://playwright.dev/) and generated end to end tests using Codegen, Playwrights test generator, to test my site and ensure everything works. I will cover this in a future post.

## Resources

- [Nuxt 3 Docs](https://v3.nuxtjs.org/)
- [Nuxt Content](https://content.nuxtjs.org/)
- [My repo](https://github.com/debs-obrien/debbie.codes)
- [Movies repo](https://github.com/nuxt/movies)
