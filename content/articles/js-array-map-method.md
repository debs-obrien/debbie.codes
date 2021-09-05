---
title: The JavaScript Array.Map() method
date: 2020-08-09
description: The .map() method in JavaScript lets you loop over every element in an array and modify or add to it and then return a different element to take that elements place
image: photo-1512418490979-92798cec1380?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop
provider: imgix
tags: [JavaScript, all]
---

Before we dive into the `.map()` method let's just recap on what is an array. An array is a data structure that contains a group of elements. Think of it like a a big box that inside it has some smaller boxes which can be found by their index. So the box in position 0 will be the first box and box with position 1 will be the second box. Inside these smaller boxes we can have a string of text or numbers or Objects.

```js
const people = ['first item', 'second item']
```

```js
const people = [
  {
    firstName: 'Debbie',
    lastName: "O'Brien"
  },
  {
    firstName: 'Jake',
    lastName: 'Dohm'
  }
]
```

The `.map()` method allows you to loop over every element in an array and modify or add to it and then return a different element to take that elements place. However `.map()` does not change the original array. It will always return a new array. We generally use the `.map()` method when you want to add to or modify some data of an array but will have the same amount of elements as the original array.

The `.map()` method takes a function which accepts 3 arguments. The first one is the current value, the second is the index and the third one is the original array we are iterating over.

```js
const names = people.map(function(currentValue, index, allPeople) {})
```

The function will look over the array of people and will run once for each item in the array. It therefore makes more sense to name the first argument person, the singular version of people. Most of the time you will only need and use the first argument.

```js
const names = people.map(function(person) {})
```

We can use an arrow function instead of an anonymous function. And as we only are using one argument we can remove the brackets from person.

```js
const names = people.map(person => {})
```

Inside the function we need to return something. As the `map()`method calls the function on each item in the array, whatever we return in the function becomes that items value. Therefore if we return `person` we will get back exactly what we had in the original array.

```js
const names = people.map(person => {
  return person
})
```

We can return anything we want even though the original array is an array of Objects we could return a string instead. If we return a string with some text then we will get that same string for each item in the array.

```js
const names = people.map(person => {
  return 'Debbie'
})
```

Normally what we want to do is to modify the data or add to it. We could create a variable called fullName and concatenate the values of firstName and lastName.

```js
const names = people.map(person => {
  return {
    fullName: `${person.firstName} ${person.lastName}`
  }
})
```

This will give us a new array with only the fullName returned as that is all we asked for. If however we wanted to have the full name as well as all the rest of the contents in the array we can also easily return them.

```js
const names = people.map(person => {
  return {
    fullName: `${person.firstName} ${person.lastName}`,
    firstName: person.firstName,
    lastName: person.lastName
  }
})
```

In this example we only have 2 other keys the firstName and lastName but imagine if we had more such as age, address etc. It would be tedious to have to write all of these out. Instead we can use the spread operator. The spread operator expands an iterable object into the list of arguments. We prefix the value with an ellipsis of three dots `...person`.

```js
const names = people.map(person => {
  return {
    fullName: `${person.firstName} ${person.lastName}`,
    ...person
  }
})
```

And that's it. We now have a new array of names with a fullName plus the first and last names. We can add more keys to the objects in our people array and we will receive these new keys without having to modify anything thanks to the use of the spread operator. And of course we could in fact add more than one item to the names array if we wanted to. Have fun with `.map()`.

This article is inspired by [Jake Dohm's video](https://simplygoodwork.com/blog/array-map-javascript-method) which I encourage you to check out.

Or play around with the [codepen](https://codepen.io/debs-obrien/pen/YzqXVgd) I created.
