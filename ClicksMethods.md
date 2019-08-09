# Clicks and Methods

In Vue we can use the v-on directive to listen to DOM events and run some JavaScript when they’re triggered. The shorthand version of v-on: is @. For example we could write a directive for a click event like this v-on:click which will work exactly the same as writing @click.

A simple example of a click event would be to add a person to a booking. We can create a button with a click directive and add some logic which in this case is adult is equal to adult plus 1. So every time we click the button the value of adult will increment by 1. We can then use the double moustaches to print the value of adult. {{ adult }}.

```vue
<template>
  <div>
    <span>Adult</span>
    <button @click="adult += 1">
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

But it is not always a good idea to add the logic direct into our click event as most of the time the logic is more complex than just a simple add and minus. For this we use methods and we can easily pass in the name of a method instead of our logic. We can simply name our methods minusAdult and addAdult. Every time an event occurs, that method is called.

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

We now define our methods under the methods object. The first method we have is addAdult which is a function. Inside the function we add our logic as we did above but this time the only difference is we need to add the this keyword which allows us to access any of the data properties. this.adult refers to the adult property in our data.

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
    <button>Click Me</button>
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

In order for our button to work we need to add a click directive and tell it what to do when we click it. We want it to show the div and when we click it again we want it to hide the div. Basically we want to toggle it so let's call our method toggle.

```vue
<button @click="toggle">Click Me</button>
```

What we want to toggle is the div so in order to do that we need to use the v-show directive. We want it to show only when we click the button. Let's create a data property called `isOpen` and set it to false. We can then add this value to our v-show directive so basically only show when isOpen is true.

```vue
<div v-show="isOpen">
```

```vue
data() { return { isOpen: false, }
```

Now you will see that our list is not visible as the value of `isOpen` is set to false. In order to make it true we need to create our toggle method that will toggle that value between true and false. We do this by making our data property isOpen equal to the opposite of its value. `this.isOpen = !this.isOpen` which basically means if the value is false make it true and if it is true make it false. so every time we click our button we trigger the toggle method which makes our value of isOpen true or false and when the value is true our div appears.

```vue
methods: { toggle() { this.isOpen = !this.isOpen }, },
```

Accordion Component

The accordion component is toggled by a click event @click="toggleItem" which calls the toggle method to toggle between show or not show. See below.

The div containing the content has a v-show="show" and then the named slot inside it. This is only visible if the v-show is true.

At the start we need to set show to be false as we do not want the accordion to be open until we click.

```vue
data() { return { show: false, } }, methods: { toggleItem() { this.show = !this.show }, },
```
