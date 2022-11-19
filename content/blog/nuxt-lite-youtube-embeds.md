---
title: Lite YouTube Embeds
date: 2021-01-29
description: If you are adding YouTube videos to your site you might notice that they can load quite slowly especially when loading iframes. However this is a better way. With this library your YouTube videos will load super fast and your site will be more performant because of it.
image: f_auto,q_auto/v1611939855/debbie.codes/blog/Screenshot_2021-01-29_at_18.03.52_yuqsr3
provider: cloudinary
tags: [nuxt, performance]
---

We normally like to add YouTube embeds to our site so that users can easily click on a video and just watch it right there in your site and it is up to them if they want to watch in full screen or watch direct in YouTube itself. But when you have a page with lots of YouTube videos it can negatively affect performance. I have such a page where I load all the interviews and as I have done quite a lot of them the page takes a few seconds to fully load those videos.

## Lighthouse Tests with iframe

For those of you who regularly run a lighthouse test you might have come across this warning:

![lighthouse test facade warning](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1611938884/debbie.codes/blog/Screenshot_2021-01-29_at_10.37.43_meeyhu.png)

Also you will see when testing on mobile how this page which has many YouTube embeds was giving a poor performance score with the Largest Contentful Paint of 8.8 seconds and time to interactive of 6.3 seconds.

![lighthouse test scores](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1611939169/debbie.codes/blog/Screenshot_2021-01-29_at_16.34.14_jcv8ok.png)

## Performance Tab with iframe

And if we investigate a little further we can see in the Performance tab how long it is taking for the video frame to load meaning our user is getting this black empty box for quite a while until the video is ready. ![Chrome performance test](https://res.cloudinary.com/debsobrien/image/upload/c_scale,f_auto,q_auto,w_1400/v1611938884/debbie.codes/blog/Screenshot_2021-01-29_at_16.36.35_fa339w.png)

## Solution

Did you know that third-party embeds can be lazily loaded on interaction? A facade is used in place of the third-party content until the user actually interacts with it.

## What's a facade?

A facade is a static element which looks like the actual embedded third-party but it is not functional which makes it much quicker to load. In this case it's basically just an image that looks like a YouTube video.

Instead of adding the third-party embed direct in our HTML, we load the page with a static element that looks similar to it and once the user interacts with this facade by placing their mouse over it, it then preconnects to the third-party resource and when the user clicks it replaces itself with the third-party product, in this case the actual video.

## Lighthouse Tests with a facade

Running a Lighthouse test using a facade we can see a huge difference especially in our Largest Contentful Paint which is in orange instead of red and with 3.8 seconds versus 8.8 seconds from the previous test. Also the time to Interactive has dropped from 6.3s to 3.3s and is now in green. This is a massive increase in performance with very little work needed. ![Lighthouse test scores](https://res.cloudinary.com/debsobrien/image/upload/c_scale,f_auto,q_auto,w_1400/v1611939855/debbie.codes/blog/Screenshot_2021-01-29_at_18.03.19_tlqdpj.png)

## Performance Tab with a facade

And if we check in our performance tab in the Chrome dev tools we can see how our image for our video has loaded so much earlier in the timeline and the total blocking time is also reduced from 1366ms to 567ms.

![Chrome performance tab](https://res.cloudinary.com/debsobrien/image/upload/c_scale,f_auto,q_auto,w_1400/v1611939855/debbie.codes/blog/Screenshot_2021-01-29_at_18.03.52_yuqsr3.png)

## Watch the difference

In order to really see the difference in load times you just have to watch this video which shows the YouTube videos loaded with an iframe first followed by the YouTube videos loaded with a facade. The difference really is insane.

![Difference between iframe and facade](https://res.cloudinary.com/debsobrien/video/upload/f_auto,q_auto/v1611941119/debbie.codes/blog/facade_upiufl.gif)

## Lite YouTube Embed library

In order to add a facade to your YouTube videos I recommend the [Lite YouTube Embed library](https://www.npmjs.com/package/lite-youtube-embed) by Paul Irish.

The library instructions are pretty easy to follow but If working with Nuxt then here's what you can do:

1. Install the package

```bash
yarn add lite-youtube-embed
```

2. Add the CSS. You can add it to the component you are using directly or to the global styles in the CSS array in the Nuxt config file.

```js{}[nuxt.config.js]
export default {
  css: ['node_modules/lite-youtube-embed/src/lite-yt-embed.css']
}
```

3. Create a plugin that imports the JavaScript for the package. Make sure to add `.client.js` to the end of the filename so that it is only loaded client side as this library makes use of the `HTMLElement` which we only have access to in the browser.

```js{}[plugins/youtube.client.js]
import 'lite-youtube-embed'
```

4. Register the plugin in your Nuxt config file so it can be used across the site.

```js{}[nuxt.config.js]
export default {
  plugins: ['~/plugins/youtube.client.js']
}
```

5. Use the element where ever you want and just change the videoid for your video and the playlabel for whatever you want it to be. You can also add params for start times etc

```js{}[components/vidoes.vue]
<lite-youtube
  videoid="ogfYd705cRs"
  playlabel="Play: Keynote (Google I/O '18)"
  params="controls=0&start=10&end=30&modestbranding=2&rel=0&enablejsapi=1
/>
```

## Behind the Scenes

Your video will now appear on your page and if you inspect the `HTML` you will see the following: ![rendered html from library](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1611942696/debbie.codes/blog/Screenshot_2021-01-29_at_18.50.42_bdctou.png)

And as you can see a background image was added, which looks the same as the video, without you even having to create it. This is how a facade works. ![background image](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1611942698/debbie.codes/blog/Screenshot_2021-01-29_at_18.51.18_ifwfgr.png)

As soon as the user clicks on the video the famous iframe is loaded and the video plays straight away. The user has no idea you used a facade. All they know is that it loaded super fast and therefore they had a very good user experience. ![html showing iframe](https://res.cloudinary.com/debsobrien/image/upload/f_auto,q_auto/v1611943517/debbie.codes/blog/Screenshot_2021-01-29_at_19.04.47_bhero2.png)

I encourage you to give it a try or at least investigate more about it in the links below.

## Recommended Links

- [Page using a facade on this site](https://debbie.codes/resources/interviews)
- [Third Party Facades from Web.dev](https://web.dev/third-party-facades/)
- [Lite YouTube Embed by Paul Irish](https://www.npmjs.com/package/lite-youtube-embed)
- [Demo from Paula Irish](https://paulirish.github.io/lite-youtube-embed/)
