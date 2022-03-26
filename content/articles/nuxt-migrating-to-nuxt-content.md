---
title: Migrating to Nuxt content
date: 2020-07-17
description: If you already have documentation set up and would like to migrate to Nuxt Content then this guide should help you make migrate easily and take advantage of what the docs theme gives you.
image: photo-1516979187457-637abb4f9353?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop
provider: imgix
tags: [nuxt, Content, all]
---

Nuxt content has released a [docs theme](https://content.nuxtjs.org/themes/docs) so that you can easily create and manage documentation for your module or project using markdown files. You also have the possibility of adding vue components into your markdown as well as modifying the color scheme with tailwind and so much more. If you already have documentation set up and would like to migrate to Nuxt Content then this guide should help you make migrate easily and take advantage of what the docs theme gives you.

## Getting Started

If you already have a docs folder make sure you first rename it to old-docs or similar then it will be easier to move all the markdown files into the new docs folder.

In the project run the command

```bash
yarn create nuxt-content-docs docs
```

You can answer all prompts or just press enter and answer them later.

## Modifying the settings

In the content folder inside the docs folder you can fill in the following info:

```js
{
  "title": "Nuxt Content", // title of your module
  "url": "https://content.nuxtjs.org", // url of your docs
  "logo": {
    "light": "/logo-light.svg",
    "dark": "/logo-dark.svg"
  },
  "github": "nuxt/content", // module name on github
  "twitter": "@nuxt_js" // twitter handler
}
```

## Adding your images

In order for the images to work you will need to add your own logo and images to the static folder keeping the same naming convention:

```bash
static/
  icon.png // for pwa
  logo - dark.svg // dark logo
  logo - light.svg // light logo
  preview.png // main preview image for main page and social sharing
  preview - dark.png // dark mode preview image
```

## Modifying the content

### index page

The index page contains an empty category with position 1. This means it will be at the top of the navigation and not be under any category making it easier to find. The features are what will be shown in the list and more features can be added.

```yaml
---
title: Introduction
description: 'i18n (Internationalization) for your Nuxt project'
position: 1
category: ''
features:
  - Integration with vue-i18n
  - Automatic routes generation and custom paths
  - Search Engine Optimization
---
```

Feel free to add more content and of course a video would be great if possible.

### setup page

In the setup page you will see we have a title and description as well as a position of 2 and a category of Guide. This means this will be positioned in the navigation in second place, after the index page and it will be under a heading of Guide.

```yaml
---
title: Setup
description: 'How to setup i18n'
position: 2
category: Guide
---
```

### Adding more pages

All pages from the old docs can be copied over to this new docs folder inside the en folder for english docs. Then every page will need the yaml block at the top modified to include the title and description and the category and position. To create a new category just add the new category title such as API instead of Guide for example and then the position number. Do not use position 1 here as the position does not start at the beginning when creating a new category. You can use position 10 or 100 for each category if you find it keeps things easier to manage.

```yaml
---
title: API Reference
description: 'API Reference'
position: 20
category: Api
---
```

## Making use of the components

You may have in your previous docs used notes or alerts. These can now be modified to use the alert component.

- `<alert type="info"></alert>` (info is the default value)
- `<alert type="warning"></alert>`
- `<alert type="success"></alert>`
- `<alert type="danger"></alert>`

If you are adding code blocks inside these alerts you may find that it doesn't work properly. This is because components inside markdown require a space between the html and the markdown content when it has a link inside it or highlighting. A best practice is to always leave an empty line between them.

```html
<alert type="warning">
  This is a `warning` with an empty line above and below
</alert>
```

See the [docs](https://content.nuxtjs.org/themes/docs#components) for more available components

## Adding file Names

You may already have some code in your markdown with the filename as a comment. This can be improved as the docs theme will show the filename in the top corner of the code which looks much tidier. You can do this by adding the filename inside square brackets after the type of code you want to show. The curly brackets are used for code highlighting. See the [docs](https://content.nuxtjs.org/writing#codeblocks) for more info regarding code highlighting.

```js{}[nuxt.config.js]
{
  modules: ['nuxt-i18n'],
}

```

## Adding another language

If you documentation is in multiple languages then there is very little you have to do in order for it to work. First add the language to the nuxt config file inside the default theme.

```js
export default theme({
  i18n: {
    locales: () => [
      { code: 'fr', iso: 'fr-FR', file: 'fr-FR.js', name: 'Français' },
      { code: 'en', iso: 'en-US', file: 'en-US.js', name: 'English' }
    ],
    defaultLocale: 'en'
  }
})
```

Then create the folder for the new language for example fr for french. And then add your translated docs here.

You will now see at the bottom that there is an icon for languages and clicking this will change the page to the new language.

## Changing the color scheme

If you want to add your own colors you can override the default tailwind color scheme. Check out this awesome [color shades generator for TailwindCSS](https://javisperez.github.io/tailwindcolorshades/#/) so you can create these colours easily.

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          100: '#FCEDEE',
          200: '#F8D3D5',
          300: '#F3B9BB',
          400: '#EB8488',
          500: '#E24F55',
          600: '#CB474D',
          700: '#882F33',
          800: '#662426',
          900: '#44181A'
        }
      }
    }
  }
}
```

## Modifying or adding the Build command

Add a netlify.toml or modify the existing one if your docs are being published to Netlify. We need to use the base of docs, if that is what you named the folder for your docs. Then add the generate command to generate a static site and the dist folder so Netlify knows which folder to publish and the ignore rule to make sure package.json is kept up to date as Netlify will skip the build process if only the content has changed.

```json
# https://docs.netlify.com/configure-builds/file-based-configuration

[build]
  base    = "docs"
  command = "yarn generate"
  publish = "dist"
  ignore  = "git diff --quiet HEAD^ HEAD . ../package.json"
```

And that's it your new docs theme is now ready to go live. Don't forget to remove any previous unused packages and delete the old docs folder that you no longer need.

There are more things you can add such as a codeSandbox or your own custom components. Check out the [docs](https://content.nuxtjs.org/themes/docs) for more things that can be done with the nuxt content docs theme.
