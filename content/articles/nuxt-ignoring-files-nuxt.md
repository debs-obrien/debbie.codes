---
title: ignoring your files with Nuxt.js
date: 2020-04-24
description: In Nuxt.js there are 3 different ways to ignore files during the build phase. This is great for static site generation which means you can still generate your site with a broken page as it will be ignored.
image: https://images.unsplash.com/photo-1557487307-8dc8ec048eb8?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [Nuxt]
---

In Nuxt.js there are 3 different ways to ignore files during the build phase. This is great for static site generation which means you can still generate your site with a broken page as it will be ignored.

1. Create a `.nuxtignore` file in your root directory. You can ignore layouts, pages, store and middleware files. The `.nuxtignore` file works the same as the `.gitignore` or `.eslintignore` in that each line is a glob pattern indicating which files should be ignored.

```md
# ignore the about page

pages/about.vue

# ignore a page inside the blog folder

pages/blog/\*.vue
```

2. You can also ignore files using the ignorePrefix property by prefixing your file with a `-`. This is a very quick way of ignoring your file as you just need to modifying it's name. `pages/-about.vue`

3) You can also use the ignore Property in our `nuxt.config.js file` which is more customisable than using the ignorePrefix property. All files matching a glob pattern specified inside ignore will be ignored during the build process. This means you can easily ignore more than one file. For example to ignore all pages starting with booking:

```javascript
export default {
  ignore: 'pages/booking*.vue'
}
```

Ignoring files is extremely helpful when developing and fixing bugs especially if you break your site and need to generate a new one. By ignoring the broken file/files/folder you can still publish your site and then work on the broken file another time without having to delete it or send it to another branch that might get forgotten about. Of course if you are ignoring files don't forget to later remove them when you want them to be added to the build phase.

All 3 options are just as good but I tend to use the ignorePrefix when I am debugging a particular page. I use the ignore property in the `nuxt.config.js` file when I need to push to production as it is easier for people to see what is going on in the pull request and clearer to understand than the prefix option. I rarely use the `.nuxtignore` file as I find people tend to look into the `nuxt.config.js` file to see what is going on and they might not come across or understand the `.nuxtignore` file when trying to figure out why a particular page is not building. But of course feel free to use the method that best suits you.

For more info and examples on the ignore property see the [Nuxt.js docs](https://nuxtjs.org/api/configuration-ignore).
