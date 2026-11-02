---
title: How Progressive Web Apps work
date: 2021-02-04
description: Progressive web apps will really help your performance and you can install them on your home screen or desktop and have that app like feel for your website. Let's have a look at how they work.
image: /images/content/blog/install-app_z3nqdh.webp
video: 3RWBkPdKtBQ
tags: [nuxt, performance]
---

Progressive web apps can hugely improve your performance. If you're internet goes down, you and your customers will still see your site instead of the Downasaur that Chrome shows you when you have no internet connection.

To see how it works open the [Nuxt website](https://nuxtjs.org/) and turn off your internet and you will see that you can still browse some of the pages. Of course not all of them, as to cache all the pages of the site would have a negative effect on performance. Anything that has previously been visited will be cached as well as the pages that have been prefetched.

## The Service Workers

PWAs are made possible by the use of Service Workers that are working in the background of your application. Their job is to store what is needed for the first-time load of the app. This is done by caching some static assets which can of course speed up the performance of your web whether you are connected to the internet or not.

## The Manifest File

The manifest file is a config file that contains your applications information such as the icon to be displayed, it's name, theme color and so much more. The [Nuxt PWA module](https://pwa.nuxtjs.org/) will set all this up for you and you can customize it further if you want to. You can easily see what has been setup by opening the Application tab of the Chrome Dev Tools.

![Manifest file](/images/content/blog/manifest-json_px311e.webp){width="798" height="858"}

## The Icons

On of the requirements of a PWA is to have an icon which must be 512x512 pixels in size. This should be in the static folder of your Nuxt application. The icon is what will be shown to the user when they download your app to their mobile or desktop. Nuxt will automatically create the different sizes needed for the different devices. Again you can see this in the Application tab in the Chrome Dev Tools.

![pwa icons](/images/content/blog/pwa-icons_f28jtg.webp){width="828" height="786"}

## Installing your app

When browsing your apps website if a manifest file is found Chrome will trigger the web app install button so the user can install your application should they want to.

![install app](/images/content/blog/install-app_z3nqdh.webp){width="690" height="486"}

## Using the app

Once you have installed the application you can save it in the dock or even ask Siri to open your application for you, making it easer to find than opening the website in the browser. Once you close the app and open it again new content will be fetched so the PWA is always up to date.

![PWA installed](/images/content/blog/pwa-installed_kw8gym.webp){width="1640" height="1428"}

## Lighthouse Scores

And of course make sure you check your Lighthouse Score, which has changed in Lighthouse 7 (available in Chrome Canary), and now only includes 2 categories, Installable and PWA Optimised. Previously in Lighthouse 6 there were 3 categories.

The Fast and reliable category has now been removed due to the revamped installability requirements which now includes `offline-capability` checking and there are some other changes such as `load-fast-enough-for-pwa` audit which has been removed since Lighthouse's existing performance metrics more than cover the needs.

![lighthouse pwa score](/images/content/blog/lighthouse_cwbemf.webp){width="1640" height="1140"}

At the time of writing the only thing I had to add to the Nuxt PWA module to get full score was the theme colour as the default is `undefined` and Lighthouse requires it to be set. The theme colour can be set by adding it to the `pwa.manifest.theme_color` in your Nuxt config file.

```js{}[nuxt.config.js]
pwa: {
    manifest: {
      theme_color: '#091a28'
    }
  },
```

## Useful Links

- [Nuxt PWA module](https://pwa.nuxtjs.org/)
- [Lighthouse 7 release notes](https://github.com/GoogleChrome/lighthouse/releases)
