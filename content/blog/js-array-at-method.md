---
title: The JavaScript Array.at() method
date: 2022-05-12
description: Often we want to return a single item from an array. There are a few methods of doing this including the `at(index)` method which returns the item at a given index.
published: true
image: photo-1562755524-cb3e786bee18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGF0fGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60
provider: imgix
ogImage: https://images.unsplash.com/photo-1562755524-cb3e786bee18?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjJ8fGF0fGVufDB8MHwwfHw%3D&auto=format&fit=crop&w=800&q=60
tags: [javascript]
---

Often we want to return a single item from an array. There are a few methods of doing this including the `at(index)` method which returns the item at a given index. It takes both positive and negative values where negatives values count back from the last item in the array.

Let's take a look and compare this method with the methods we might be more familiar with.

## Getting the index of the first item in an array

Using square bracket notation is also still perfectly fine and to get the first item in an array you can do:

### Using the array length method

You an use the square brackets passing in the index of 0 to get the first item in the array.

```js
array[0]
```

### Using the at method

You can also use the `at()` method passing in the index of 0 to get the first item in the array.

```js
array.at(0)
```

## Getting the index of the last item in an array

### Using the array length method

The real difference is when you want to get the last number in the array. It is very common to use the length property of an array and subtract 1, to get the last item in the array. We use a -1 because arrays start at 0 and not 1.

```js
array[array.length - 1]
```

### Using the slice method

Or you could use the slice method where you can slice from one index to another to get the value you want. However this method will return an array which might not necessarily be what you want.

```js
array.slice(-1)
```

### Using the at method

Although there is nothing wrong with using the method above we can use a shorter syntax using the at() method and passing in the value of -1 without having to use the `array.length`.

```js
array.at(-1)
```

Again both methods are fine so use the one you prefer.

## Example

To see a real example in use, let's create an array of food and then find the index of the first and last item in the array.

```js
const food = ['pizza', 'burgers', 'sushi', 'steak', 'salad']

console.log(food[0]) // pizza

console.log(food.at(0)) // pizza

console.log(food[food.length - 1]) // salad

console.log(food.slice(-1)) // [salad]

console.log(food.at(-1)) // salad
```

Paste it in your console and see for yourself or play around with the indexes to get different results Or checkout the [codepen](https://codepen.io/debs-obrien/pen/vYdXxdy) I created.

Again all methods work perfectly fine so choose the one you prefer. The `at()` method seems quite nice and easy to remember too and it has full browser support too. (Unless you need Internet Explorer or Opera for Android).

## Learn More

To read more about it check out the MDn docs for [Array.prototype.at()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at)

- Check out my post on the [array filter method](/blog/js-array-filter-method)
- Check out my post on the [array map method](/blog/js-array-map-method)
