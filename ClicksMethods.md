# Build a Counter, a Dropdown and an Accordion

## Counter

In Vue we can use the `v-on` directive to listen to DOM events and run some JavaScript when they’re triggered. The shorthand version of `v-on:` is `@`. For example we could write a directive for a click event like this `v-on:click` which will work exactly the same as writing `@click`.

A simple example of a click event would be to add a person to a booking. We can create a button with a click directive and add some logic which in this case is adult is equal to adult plus 1. So every time we click the button the value of adult will increment by 1. We can then use the double moustaches to print the value of adult. `{{ adult }}`.

```vue
<template>
  <div>
    <span>Adult</span>
    <button @click="adult += 1">+</button>
    <p>{{ adult }} adults</p>
  </div>
</template>
```

But of course first we have to set the value of adult otherwise the button doesn't know what to add 1 to. We do that by adding it to the data of our component and setting its value to 0.

```vue
<script>
export default {
  data() {
    return {
      adult: 0,
    }
  },
}
</script>
```

And just as easily we can create a minus button to remove all those adults that we just added.

```vue
<button @click="adult -= 1">-</button>
```

But it is not always a good idea to add the logic direct into our click event as most of the time the logic is more complex than just a simple add and minus. For this we use methods and we can easily pass in the name of a method instead of our logic. We can simply name our methods `minusAdult` and `addAdult`. Every time an event occurs, that method is called.

```vue
<template>
  <div>
    <button @click="minusAdult">-</button>
    <span>Adult</span>
    <button @click="addAdult">+</button>
    <p>{{ adult }} adults</p>
  </div>
</template>
```

We now define our methods under the methods object. The first method we have is `addAdult` which is a function. Inside the function we add our logic as we did above but this time, the only difference is, we need to add the `this` keyword which allows us to access any of the data properties. `this.adult` refers to the adult property in our data.

```vue
<script>
export default {
  data() {
    return {
      adult: 0,
    }
  },
  methods: {
    addAdult() {
      this.adult += 1
    },
    minusAdult() {
      this.adult -= 1
    },
  },
}
</script>
```

Now everything works just like before but this time all our logic is in our methods which also makes it easier to work with and modify than having it direct in the code.

## Dropdown Component

Let's make a simple dropdown component. All we need is a button and a div with a list inside it.

```vue
<template>
  <div>
    <button>Dropdown</button>
    <div>
      <ul>
        <li>Nuxt</li>
        <li>Vue</li>
        <li>Webpack</li>
      </ul>
    </div>
  </div>
</template>
```

In order for our button to work we need to add a click directive and tell it what to do when we click it. We want it to show the div and when we click it again we want it to hide the div. Basically we want to toggle it so let's call our method `toggle`.

```vue
<button @click="toggle">Click Me</button>
```

What we want to toggle is the `div` so in order to do that we need to use the `v-show` directive. We want it to show only when we click the button. Let's create a data property called `isOpen` and set it to false. We can then add this value to our `v-show` directive so basically only show when `isOpen` is `true`.

```vue
<div v-show="isOpen">
```

```vue
data() { return { isOpen: false, } }
```

Now you will see that our list is not visible as the value of `isOpen` is set to `false`. In order to make it true we need to create our toggle method that will toggle that value between true and false. We do this by making our data property `isOpen` equal to the opposite of its value. `this.isOpen = !this.isOpen` which basically means if the value is false make it true and if it is true make it false. so every time we click our button we trigger the toggle method which makes our value of isOpen true or false and when the value is true our div appears.

```vue
methods: { toggle() { this.isOpen = !this.isOpen } }
```

## Accordion Component

An accordion component works very similar to the dropdown component. But if we were to copy what we did in the dropdown component then it would not work as expected as if you clicked on any of the titles all the accordions would open. We want only the one we click on to actually open and close. We could of course create a toggle method for each one but there is an easier way of doing it and that is by using `slots`.

First we create a parent component for our Accordion which we will call `BaseAccordion`. This is very similar to the dropdown component in that we add a `@click` method to the div with the value of `toggle` and a `v-show` directive with the value of `show`. The only difference is that instead of adding the content we add a `slot`. As we have 2 slots, one for the title and one for the content we shall used named slots. That way it will be easier to define which one is which when we go to use it.

```vue
<template>
  <div>
    <div @click="toggle">
      <h2>
        <slot name="title"></slot>
      </h2>
      <span>+</span>
    </div>
    <div v-show="show">
      <slot name="content"></slot>
    </div>
  </div>
</template>
```

Then in our script tag just like before we need to add a data property of `show` with the value of `false` as we don't want to show it until it is clicked and a toggle method that toggles the value so that everytime the toggle method is activated true becomes false or false becomes true.

```vue
<script>
export default {
  components: {},
  data() {
    return {
      show: false,
    }
  },
  methods: {
    toggle() {
      this.show = !this.show
    },
  },
}
</script>
```

We now need to use this accordion in our component. What we have created is a base component that can then be used in many places as we could have various accordions on our site. Let's create a Tech Accordion component that will then use the Base Accordion. To do this we need to import the `BaseAccordion`.

```vue
<script>
import BaseAccordian from '@/components/_base-accordion'

export default {
  components: {
    BaseAccordian,
  },
}
</script>
```

And in our template we can use the `v-for` directive so that for every accordion in the accordions array we will print a `BaseAccordion` component. The difference with this component is that we use the template tag inside it to make referece to the slot we want to use by using the `v-slot` directive. And then inside the template we add the information we want to show which in our case is the title of the accordion from the accordions array. We do the same for the content slot and as you can see we want to use a `div` inside the slot which is also possible.

```vue
<template>
  <div>
    <div v-for="accordion in accordions" :key="accordion.title">
      <BaseAccordian>
        <template v-slot:title>
          {{ accordion.title }}
        </template>

        <template v-slot:content>
          <div>
            {{ accordion.text }}
          </div>
        </template>
      </BaseAccordian>
    </div>
  </div>
</template>
```

Now we just have to create our array of content for our accordion. We do this by adding a propety to our data called accordions and adding an array with different values. We can add as many as we want here and the `v-for` will print out an accourdion for every entry we have.

```vue
data() { return { accordions: [ { title: 'Vue', text: 'All about Vue', }, {
title: 'Nuxt', text: 'All about Nuxt', }, { title: 'webpack', text: 'All about
webpack', }, ], } }
```

And that's it we now have a fully working Counter, Dropdown and Accordion component using Vue`s directives and methods. I hope you have fun making some really cool components.
