---
title: Formatting a date in JavaScript
date: 2020-10-09
description: How to format a date in JavaScript without using any libraries so you easily display dates in your Vue or Nuxt application
image: photo-1595437037073-edcf5af767dd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop
provider: imgix
tags: [javascript, all]
---

When it comes to dates we often add big libraries like Moment.js or Luxon just to format a simple date. But it is actually much simpler than that by using the `toLocalDateString()` method. We don't have to install any packages. It just works

In the example below we are using vue so therefore we create a method called `formatDate()` and pass in the date that we want to format. We then set our options of how we want the date to be shown. This is an object where we can choose if we want the month to be numeric or long for example. We then return the new date passing in our date we want formatted. We then chain our `toLocalDateString()` method passing in the language we want to use followed by the options.

```js
<script>
export default {
  methods: {
    formatDate(date) {
      const options = { year: 'numeric', month: 'long', day: 'numeric' }
      return new Date(date).toLocaleDateString('en', options)
    },
  }
};
</script>

```

## Different Options

We can then use our method like we would use any Vue method in our template passing in the date want formatted

```html
<template>
  <p> {{ formatDate('2020-12-25') }} </p>
</template>
```

Result: **December 25, 2021**

We can also use different options. Perhaps we want to show the day of the week. We can do this by adding in the weekday.

```js
formatDateDay(date) {
  const options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-us', options)
},
```

Result: **Friday, October 9, 2020**

## Different Locales

And we can also pass in different locales so we get the date in the right order which is especially useful for when working with UK v US date formatting.

```js
formatDateEN(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-GB', options)
},
```

Result: **25/12/2020**

```js
formatDateUS(date) {
  const options = { year: 'numeric', month: 'numeric', day: 'numeric' }
  return new Date(date).toLocaleDateString('en-US', options)
},
```

Result: **12/25/2020**

And of course we can also change the format to show the day and month in a different language.

```js
formatDateDayEs(date) {
  const options = {  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(date).toLocaleDateString('es', options)
},
```

Result: **viernes, 25 de diciembre de 2020**

## Example

- **[See my CodePen](https://codepen.io/debs-obrien/pen/oNLgJda)** to play around with the dates.
- **[See the Mozilla Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleDateString)** for more info.
