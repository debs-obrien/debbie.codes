---
title: The JavaScript Array.filter() method
date: 2020-08-09
description: The .map() method in JavaScript lets you loop over every element in an array and modify or add to it and then return a different element to take that elements place
published: false
image: https://images.unsplash.com/photo-1512418490979-92798cec1380?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=800&q=60
tags: [JavaScript]
---

To filter an array

filter to find only the female characters

array of people

```jsx
const people = [{name: 'Debbie', gender: 'female'}
{name: 'Josh', gender: 'male'}]
```

decide who should be returned

```jsx
people.filter(function(currentValue, index, originalArray) {
  //decide who should be returned
  return
})
```

return true then all the people will be in the array

return false then nobody will be in the array

function takes 3 arguments

currentValue which is the currentValue of the item we are iterating over

index, what iteration we are on

originalArray which in this case is people

if you don't need the originalArray you can remove it

```jsx
people.filter(function(currentValue, index) {
  //decide who should be returned
  return
})
```

normally we name the currentValue the singular of the array so in this case person

```jsx
people.filter(function(person, index) {
  return person.gender === 'female'
})
```

Now you will only get the female people back

We can convert to using an arrow function

```jsx
people.filter((person, index) => {
  return person.gender === 'female'
})
```

As we are not using the index we can get rid of that

```jsx
people.filter(person => {
  return person.gender === 'female'
})
```

We can also get rid of the parenthesis as we don't need them if there is only one argument in an arrow function

```jsx
people.filter(person => {
  return person.gender === 'female'
})
```

And as it is just one line we are returning we can remove the return and the curly brackets and have it all on the one line

```jsx
people.filter(person => person.gender === 'female')
```

The great thing about filter is that it does not mutate the original array. So if you console.log people you will still get all the people from the people array as filter creates a new array. Therefore we can store our new filter in a const.

```jsx
const womenn = people.filter(person => person.gender === 'female')
```

This article is inspired by [Jake Dohm's video](https://simplygoodwork.com/blog/array-map-javascript-method) which I encourage you to check out.

Or play around with the [codepen](https://codepen.io/debs-obrien/pen/YzqXVgd) I created.
