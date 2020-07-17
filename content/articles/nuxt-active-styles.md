---
title: Styling your active classes in Nuxt.js
date: 2020-06-28
---

Nuxt.js, which uses `vue-router`, can easily tell what route you are on and therefore can add a class to that link when the user is on that page. By default this class is called `nuxt-link-active`.

![nuxt-link-active](https://user-images.githubusercontent.com/13063165/84566699-9328f280-ad73-11ea-8697-d1e08b5bd0f2.png)

In order to style your active links the only thing you have to do to is add the `nuxt-link-active` class to your styles and then you can style it as you wish.

```css
.nuxt-link-active {
  color: red;
}
```

Sometimes this will also add styles to other links such as the parent routes or the home page. In order to fix this we use the exact active class. By default this class is called `nuxt-link-exact-active`.

![nuxt-link-exact-active](https://user-images.githubusercontent.com/13063165/84566719-b6ec3880-ad73-11ea-9a5d-47e7e23de987.png)
The only thing you have to do to is add the `nuxt-link-exact-active` class to your styles and then you can style it as you wish.

```css
.nuxt-link-exact-active {
  color: green;
}
```

You can add this css to your navigation component or to a specific page or layout or in your global css file. See the [nuxt docs](https://nuxtjs.org/api/configuration-css) for more information on adding global css files.

Should you want to you can also configure the classname to be something different. Although this is not necessary for it to work you might want to configure the classname to be a class that is already in your third party styles or configured in tailwind for example.

You can change the active class in your `nuxt.config.js` file using the `router` property and setting a value to `linkActiveClass`.

```javascript
export default {
  router: {
    linkActiveClass: "my-custom-exact-active-link"
  }
};
```

You can change the exact active class in your `nuxt.config.js` file using the `router` property and setting a value to `linkExactActiveClass`.

```javascript
export default {
  router: {
    linkExactActiveClass: "text-primary" // tailwind class with custom color
  }
};
```

![nuxt-link-active text-primary](https://user-images.githubusercontent.com/13063165/84566760-f2870280-ad73-11ea-8173-826ad4572478.png)

Although adding your tailwind class to the config is a great method it will cause you problems if you don't want all your active links across all pages to be that colour. If you want more control then you should use the default class name or a custom one and use scoped styling.

And that is all there is to it. If you don't already have your active links styled then go ahead and add a class for them.

See the [nuxt docs](https://nuxtjs.org/api/configuration-router#linkactiveclass) for more info on the active and exact active classes.
