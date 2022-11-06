---
title: The JavaScript Array.filter() method
date: 2022-05-11
description: The .filter() method in JavaScript creates a new array with all elements that pass the test implemented by the provided function.
published: true
image: photo-1515560570411-00a0026e6086?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmlsdGVyfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60
ogImage: https://images.unsplash.com/photo-1515560570411-00a0026e6086?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8ZmlsdGVyfGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60
provider: imgix
tags: [javascript, array, filter]
---

Sometimes we have an array but we want to return only a select few items from the array. For example, we can use the `array.filter()` method to filter an array of people to only find the female characters of the array.

```jsx
const people = [
  { name: 'Debbie', gender: 'female' },
  { name: 'Josh', gender: 'male' }
]
```

## How the filter method works

The `filter()` method calls a callback function once for each element in an array and constructs a new array for all the values that pass the test provided in this callback function.

The function takes 3 arguments,

- the current value, which is the current value we are iterating over
- the index, what iteration we are on
- the original array on which filter is called

### Returns female values

```jsx
people.filter(function (currentValue, index, originalArray) {
  //decide who should be returned
  return currentValue.gender === 'female'
})
```

### Exclude the original array

We can exclude the original array in our callback function if we are not using it. We may want to use it to push something to the array before we perform the test of what to return but if not we can simply remove it.

```jsx
people.filter(function (currentValue, index) {
  //decide who should be returned
  return currentValue.gender === 'female'
})
```

### Naming the current value

Normally we name the currentValue the singular of the array so in this case we should name it person.

```jsx
people.filter(function (person, index) {
  return person.gender === 'female'
})
```

### Using the arrow function

We can also use the arrow function instead

```jsx
people.filter((person, index) => {
  return person.gender === 'female'
})
```

### Removing the index and parenthesis

As we are not using the index we can get rid of that. We can also get rid of the parenthesis as we don't need them if there is only one argument in an arrow function

```jsx
people.filter(person => {
  return person.gender === 'female'
})
```

### Removing the brackets and return keyword

And as it is just one line we are returning we can remove the return and the curly brackets and have it all on the one line keeping it very short. This can take a bit of getting used to as it is not as easy to read as the previous examples but many people will use this format.

Think of it as, for the array of people filter every person and return the ones that have a gender of female.

```jsx
people.filter(person => person.gender === 'female')
```

## Example

The great thing about filter is that it does not mutate the original array. So if you `console.log(people) ` you will still get all the people from the people array as filter creates a new array. Therefore we can store our new filter in a const.

```jsx
const people = [
  { name: 'Debbie', gender: 'female' },
  { name: 'Josh', gender: 'male' }
]
const women = people.filter(person => person.gender === 'female')
console.log(people) // [{ name: 'Debbie', gender: 'female' },{ name: 'Josh', gender: 'male' }]
console.log(women) // [{ name: 'Debbie', gender: 'female' }]
```

Paste it in the console to see for yourself and play around with the values or check out the [codepen](https://codepen.io/debs-obrien/pen/OJQRpPW) I created.

## Learn More

- This article is inspired by [Jake Dohm's video](https://simplygoodwork.com/blog/array-map-javascript-method) which I encourage you to check out.

- To read more about it check out the MDn docs for [Array.prototype.filter()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter)
- Check out my post on the [array at method](/blog/js-array-at-method)
- Check out my post on the [array map method](/blog/js-array-map-method)
