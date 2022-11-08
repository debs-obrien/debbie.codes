---
title: Minimizing SVGs
date: 2022-05-09
description: When working with SVG's sometimes we just put the svg into our code and think nothing more of it. But do we always need all that code that the SVG gives us? Perhaps not. SVGO is a tool that can take an SVG and compress it down to a smaller size ensuring your site is more performant.
image: v1652107148/debbie.codes/blog/2022/dev-logo-svgomg_2x_ljbh5t.png
ogImage: https://res.cloudinary.com/debsobrien/image/upload/f_webp,q_80,c_fit,w_480/v1652107148/debbie.codes/blog/2022/dev-logo-svgomg_2x_ljbh5t.png
provider: cloudinary
tags: [performance]
published: true
loading: eager
---

Recently I decided to add the dev.to icon to my site in the footer. From the [dev.to site's brand page](https://dev.to/brand) I can easily get the icon in svg format. Once I download this icon I can drag and drop it to the icons folder in my Nuxt site.

I am using the svgs inline so I need to import it in the script tag with `?inline` at the end. Then in the components object I add the component name.

```js
<script>
  import IconDevTo from '@/assets/icons/dev-rainbow.svg?inline'
  export default {
    components: {
      IconDevTo
    }
  }
</script>
```

This will import my svg file and so I can use it like I would any component.

```js
<IconDevTo class="h-10 w-10 fill-current" />
```

But the problem is that this SVG is quite big and comes with a lot of code. If we open the SVG in our editor this is the code we get.

```xml
<svg viewBox="0 0 235 234" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" class="rainbow-logo"
    preserveAspectRatio="xMinYMin meet">
  <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
    <g id="80K">
      <polygon id="Shape" fill="#88AEDC" points="234.04 175.67 158.35 233.95 205.53 233.95 234.04 212"></polygon>
      <polygon id="Shape" points="234.04 140.06 112.11 233.95 112.13 233.95 234.04 140.08"></polygon>
      <polygon id="Shape" points="133.25 0.95 0.04 103.51 0.04 103.53 133.27 0.95"></polygon>
      <polygon id="Shape" fill="#F58F8E" fill-rule="nonzero" points="0.04 0.95 0.04 31.11 39.21 0.95"></polygon>
      <polygon id="Shape" fill="#FEE18A" fill-rule="nonzero" points="39.21 0.95 0.04 31.11 0.04 67.01 85.84 0.95"></polygon>
      <polygon id="Shape" fill="#F3F095" fill-rule="nonzero" points="85.84 0.95 0.04 67.01 0.04 103.51 133.25 0.95"></polygon>
      <polygon id="Shape" fill="#55C1AE" fill-rule="nonzero" points="133.27 0.95 0.04 103.53 0.04 139.12 179.49 0.95"></polygon>
      <polygon id="Shape" fill="#F7B3CE" fill-rule="nonzero" points="234.04 0.95 226.67 0.95 0.04 175.45 0.04 211.38 234.04 31.2"></polygon>
      <polygon id="Shape" fill="#88AEDC" fill-rule="nonzero" points="179.49 0.95 0.04 139.12 0.04 175.45 226.67 0.95"></polygon>
      <polygon id="Shape" fill="#F58F8E" fill-rule="nonzero" points="234.04 31.2 0.04 211.38 0.04 233.95 18.07 233.95 234.04 67.65"></polygon>
      <polygon id="Shape" fill="#FEE18A" fill-rule="nonzero" points="234.04 67.65 18.07 233.95 64.7 233.95 234.04 103.56"></polygon>
      <polygon id="Shape" fill="#F3F095" fill-rule="nonzero" points="234.04 103.56 64.7 233.95 112.11 233.95 234.04 140.06"></polygon>
      <polygon id="Shape" fill="#55C1AE" fill-rule="nonzero" points="234.04 140.08 112.13 233.95 158.35 233.95 234.04 175.67"></polygon>
      <polygon id="Shape" fill="#F7B3CE" fill-rule="nonzero" points="234.04 212 205.53 233.95 234.04 233.95"></polygon>
      <g id="Group" transform="translate(37.000000, 77.000000)" fill="#FFFFFF">
        <path d="M28.2371517,0.75 C32.7510836,1.7 36.0111455,3.55 39.371517,7.05 C42.4309598,10.25 44.3368421,13.9 45.1393189,18 C45.7913313,21.45 45.7913313,58.55 45.1393189,62.05 C43.4340557,71.15 35.6600619,78.25 26.0303406,79.5 C24.0241486,79.75 17.3034056,80 11.1845201,80 L-7.10542736e-15,80 L-7.10542736e-15,1.42108547e-14 L12.4383901,1.42108547e-14 C21.2656347,1.42108547e-14 25.7795666,0.2 28.2371517,0.75 Z M14.5448916,40 L14.5448916,65.6 L19.7108359,65.4 C24.174613,65.25 25.1275542,65.05 27.1337461,63.9 C31.0458204,61.6 31.0959752,61.45 31.0959752,39.7 C31.0959752,18.5 31.0959752,18.5 27.4346749,16.1 C25.6291022,14.9 24.8767802,14.75 19.9616099,14.55 L14.5448916,14.4 L14.5448916,40 Z"
              id="Combined-Shape"></path>
        <path d="M93.7894737,7.25 L93.7894737,14.5 L68.2105263,14.5 L68.2105263,32.5 L83.7585139,32.5 L83.7585139,47 L68.2105263,47 L68.3108359,56.1 L68.4613003,65.25 L81.1504644,65.4 L93.7894737,65.5 L93.7894737,80 L78.993808,80 C62.5430341,80 59.9851393,79.7 57.3770898,77.4 C53.7157895,74.2 53.9164087,76.25 53.7659443,41.1 C53.6656347,19.2 53.8160991,8.85 54.1671827,7.45 C54.8693498,4.85 57.828483,1.65 60.4365325,0.75 C61.9913313,0.2 65.9034056,0.05 78.1411765,4.26325641e-14 L93.7894737,4.26325641e-14 L93.7894737,7.25 Z"
              id="Path"></path>
        <path d="M125.437152,28.1 C129.148607,42.35 132.258204,53.7 132.358514,53.35 C132.508978,53 135.668731,40.95 139.430341,26.5 L146.301548,0.25 L154.125697,0.1 C160.043963,7.10542736e-15 162,0.15 162,0.6 C162,1.05 144.64644,66.8 143.643344,70.1 C142.941176,72.4 139.179567,77.1 137.073065,78.35 C134.414861,79.85 130.502786,80.1 128.095356,78.85 C125.9387,77.75 123.079876,74.45 121.625387,71.35 C120.722601,69.45 105.97709,15.35 102.566563,1.35 L102.21548,0 L110.039628,0 C117.713313,0 117.913932,0 118.31517,1.1 C118.515789,1.75 121.725697,13.9 125.437152,28.1 Z"
              id="Path"></path>
      </g>
    </g>
  </g>
</svg>
```

We certainly don't need access to everything in the SVG and don't intend on modifying it so how can we get a lighter version of this SVG? Have you heard of of [SVGOMG BY Jake Archibald](https://jakearchibald.github.io/svgomg/). I have been using it for years and it really is a great tool.

![SVGOMG app showing open svg and paste markup options](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1652107151/debbie.codes/blog/2022/svgomg-tool_2x_ilp1yt.png)

You can either open the SVG directly or you can paste the SVG code and it will start converting the SVG to a lightweight version. You can choose what you want to remove and what you want to keep. Looking at our SVG you can see the difference in size with a saving of 71.73%.

![dev logo in svgomg app showing what was removed and savings in size](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1652107148/debbie.codes/blog/2022/dev-logo-svgomg_2x_ljbh5t.png)

You can then download the file or just copy the code directly and paste it into the SVG. You can see below the difference in code and not only how it is minified but also how it removes all the unnecessary code we don't need.

```xml
<svg viewBox="0 0 235 234" xmlns="http://www.w3.org/2000/svg" class="rainbow-logo" preserveAspectRatio="xMinYMin meet"><g fill="none" fill-rule="evenodd"><path fill="#88AEDC" d="m234.04 175.67-75.69 58.28h47.18L234.04 212z"/><path d="m234.04 140.06-121.93 93.89h.02l121.91-93.87zM133.25.95.04 103.51v.02L133.27.95z"/><path fill="#F58F8E" fill-rule="nonzero" d="M.04.95v30.16L39.21.95z"/><path fill="#FEE18A" fill-rule="nonzero" d="M39.21.95.04 31.11v35.9L85.84.95z"/><path fill="#F3F095" fill-rule="nonzero" d="M85.84.95.04 67.01v36.5L133.25.95z"/><path fill="#55C1AE" fill-rule="nonzero" d="M133.27.95.04 103.53v35.59L179.49.95z"/><path fill="#F7B3CE" fill-rule="nonzero" d="M234.04.95h-7.37L.04 175.45v35.93l234-180.18z"/><path fill="#88AEDC" fill-rule="nonzero" d="M179.49.95.04 139.12v36.33L226.67.95z"/><path fill="#F58F8E" fill-rule="nonzero" d="M234.04 31.2.04 211.38v22.57h18.03l215.97-166.3z"/><path fill="#FEE18A" fill-rule="nonzero" d="M234.04 67.65 18.07 233.95H64.7l169.34-130.39z"/><path fill="#F3F095" fill-rule="nonzero" d="M234.04 103.56 64.7 233.95h47.41l121.93-93.89z"/><path fill="#55C1AE" fill-rule="nonzero" d="m234.04 140.08-121.91 93.87h46.22l75.69-58.28z"/><path fill="#F7B3CE" fill-rule="nonzero" d="m234.04 212-28.51 21.95h28.51z"/><g fill="#FFF"><path d="M65.237 77.75c4.514.95 7.774 2.8 11.135 6.3 3.059 3.2 4.965 6.85 5.767 10.95.652 3.45.652 40.55 0 44.05-1.705 9.1-9.479 16.2-19.109 17.45-2.006.25-8.727.5-14.845.5H37V77h12.438c8.828 0 13.342.2 15.8.75ZM51.545 117v25.6l5.166-.2c4.464-.15 5.417-.35 7.423-1.5 3.912-2.3 3.962-2.45 3.962-24.2 0-21.2 0-21.2-3.661-23.6-1.806-1.2-2.558-1.35-7.473-1.55l-5.417-.15V117ZM130.79 84.25v7.25h-25.58v18h15.549V124H105.21l.1 9.1.15 9.15 12.69.15 12.638.1V157h-14.795c-16.451 0-19.009-.3-21.617-2.6-3.661-3.2-3.46-1.15-3.611-36.3-.1-21.9.05-32.25.401-33.65.702-2.6 3.661-5.8 6.27-6.7 1.554-.55 5.466-.7 17.704-.75h15.648v7.25ZM162.437 105.1c3.712 14.25 6.821 25.6 6.922 25.25.15-.35 3.31-12.4 7.071-26.85l6.872-26.25 7.824-.15c5.918-.1 7.874.05 7.874.5s-17.354 66.2-18.357 69.5c-.702 2.3-4.463 7-6.57 8.25-2.658 1.5-6.57 1.75-8.978.5-2.156-1.1-5.015-4.4-6.47-7.5-.902-1.9-15.648-56-19.058-70l-.352-1.35h7.825c7.673 0 7.874 0 8.275 1.1.2.65 3.41 12.8 7.122 27Z"/></g></g></svg>
```

Our SVG is now much lighter improving the performance of our website. I highly encourage you to give this tool, [SVGOMG BY Jake Archibald](https://jakearchibald.github.io/svgomg/), a try.
