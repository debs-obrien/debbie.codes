---
title: Let's Analyze your webpack bundles with Nuxt
date: 2020-04-16
description: As we add so many third party libraries to our site sometimes we forget that perhaps they are going to have an impact on our performance or sometimes we just don't read the install instructions and install the whole library instead of only what we need.
image: photo-1434626881859-194d67b2b86f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop
provider: imgix
tags: [nuxt, performance]
---

It is really important to know what you are shipping to production. As we add so many third party libraries to our site sometimes we forget that perhaps they are going to have an impact on our performance or sometimes we just don't read the install instructions and install the whole library instead of only what we need. So how can we analyze our bundles in Nuxt.js?

Nuxt makes it very easy for us to dive inside our webpack bundles and take a look at what is going on. Don't worry it is not scary at all. In fact the tool is very visual and really easy to launch. You can create a command in your package.json

```javascript
"scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "analyze": "nuxt build --analyze"
}
```

Or you can launch it directly in the terminal with yarn

```bash
yarn build --analyze
```

or if you don't have yarn you can use npx

```bash
npx nuxt build --analyze

```

Personally I prefer the shorthand version which is -a

```bash
yarn build -a
```

Then the webpack analyzer should launch in your browser window. ![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/zirur7w11fkojij92hn9.png)

The navigation bar on the left allows you to choose which chunks to show. You can see all of them or just select the ones you want. And at a quick glance you can see the size of all your chunks. ![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/29oo6639ua5z4om34lp9.png)

You can also double click on the boxes, hover over them for more details and right click on a chunk to easily hide it or to hide all other chunks. ![Alt Text](https://dev-to-uploads.s3.amazonaws.com/i/q4epyrbb8b51v2wwuxoq.png)

I hope you have fun analyzing your bundles but please do not deploy bundles built with "analyze" mode, they are for analysis purposes only.
