---
title: Theming in React
date: 2022-03-10
description: Theming is a fascinating topic and a really important one these days as more and more people add light and dark mode to their sites and companies change the theme of their site or part of their site on specific dates to celebrate occasions such as christmas, pride week etc.
image: photo-1595446472721-4b7aa63a2bc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80
provider: imgix
tags: [Bit, React, all]
published: true
---

Theming is a fascinating topic and a really important one these days as more and more people add light and dark mode to their sites and companies change the theme of their site or part of their site on specific dates to celebrate occasions such as christmas, pride week etc.

![color cards showing different colors and tones](https://images.unsplash.com/photo-1595446472721-4b7aa63a2bc7?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2370&q=80)

But where do we start when it comes to creating themes? It all starts with the designers. They are the ones who are creating the themes. Each theme should have a list of design tokens that show the theme colors, paddings, margins, fonts, etc. These tokens can be exported from tools such as Figma and then used in a theme component.

In this example I will show you how to do theming in React using Bit, however if you are not using Bit this will still work in any React app and you can install the one Bit component that we are using though npm or yarn. The Theme Provider component from teambit will convert these design tokens from JSON format to usable CSS variables without you having to do any extra work, which is kinda cool.

By using Bit we are making sure our components are fully independent and can be easily installed into any app. If you are not using Bit then you will need to change the import statements to use relative paths to your components. And if you are not using typescript then feel free to change the file extension to .jsx and ignore the schema which is just for type checking.

So lets get started with theming in React.

## Step 1: Create your Theme Provider Component

1. Create a new theme provider component.

2. Add a `theme-schema.tsx` file and include all types for your design tokens.

```js
export type ThemeSchema = {
  myColorText?: string
  myFontSize?: string
  myBorderColor?: string
  myBorderRadius?: string
};
```

Add a '?' to make the tokens optional so you can use tokens from the default theme as well as override any tokens the theme wants to change.

3. Add a `default-theme-tokens.tsx` file which should include all design tokens and values for your default theme.

```Js
import { ThemeSchema } from './theme-schema';

export const defaultTheme: ThemeSchema = {
  myColorBackground: '#ffffff',
  myColorText: 'purple',
  myFontSize: '26px',
  myBorderColor: 'purple',
  myBorderRadius: '5px',
};
```

4. Install the `ThemeProvider` component from teambit.

```bash
bit install @teambit/base-react.theme.theme-provider
// or
npm install @teambit/base-react.theme.theme-provider
```

5. Import the `createTheme` function from teambit's Theme Provider component and the `defaultTheme` from the `default-theme-tokens` file in your `theme-provider.tsx` file. Create your theme using the `createTheme()` function passing into it the `defaultTheme` as the value for theme.

```js
import { createTheme } from '@teambit/base-react.theme.theme-provider'
import { defaultTheme } from './default-theme-tokens'

export const Theme = createTheme({
  theme: defaultTheme
})
```

You supply the design tokens directly to the createTheme function and it does the rest for you to convert the tokens to usable css (both in modules and directly in your css).

6. Add [compositions](https://bit.dev/learn-bit-react/theming/themes/theme-provider/~code/theme-provider.composition.tsx), [tests](https://bit.dev/learn-bit-react/theming/themes/theme-provider/~code/theme-provider.spec.tsx) and [docs](https://bit.dev/learn-bit-react/theming/themes/theme-provider/~code/theme-provider.docs.mdx).

## Step 2: Use your Theme Provider

1. Import the Theme from the ThemeProvider component you created.

```js
import { Theme } from '@learn-bit-react/theming.themes.theme-provider'
```

2. Wrap all components in the theme provider to see the theme applied to your components.

```js
import React from 'react'
import { Theme } from '@learn-bit-react/theming.themes.theme-provider'
import { Button } from '@learn-bit-react/theming.example.button'

export const MyApp = () => {
  return (
    <Theme.ThemeProvider>
      <Button>Hello</Button>
    </Theme.ThemeProvider>
  )
}
```

### Button using Default Theme

You can install and use the Button component from this demo as an example or create your own and add some styles to it using css variables.

## Step 3: Create a Dark Theme Component

1. Create a new theme component.

```bash
bit create react themes/dark-theme
```

2. Add a `dark-theme-tokens.tsx` file with the design tokens and values you want to override from the default theme.

```js
import { ThemeSchema } from '@learn-bit-react/theming.themes.theme-provider'

export const darkTheme: ThemeSchema = {
  myColorBackground: '#000',
  myColorText: 'red',
  myBorderColor: 'red'
}
```

Import the ThemeSchema for type checking.

3. Import the `Theme` from the the theme provider component you just created as well as the `darkTheme` from the `dark-theme-tokens` file.

```Js
import React from 'react';
import { Theme } from '@learn-bit-react/theming.themes.theme-provider';
import { darkTheme } from './dark-theme-tokens';

export const DarkTheme = ({ children }) => {
  return (
    <Theme.ThemeProvider overrides={darkTheme}>
      {children}
    </Theme.ThemeProvider>
  );
};
```

Add the darkTheme to the overrides prop of the theme provider.

4. Make sure your index file is exporting both the `DarkTheme` component as well as the `darkTheme` tokens.

```Js
export { DarkTheme } from './dark-theme';
export { darkTheme } from './dark-theme-tokens';
```

5. Add [compositions](https://bit.dev/learn-bit-react/theming/themes/dark-theme/~code/dark-theme.composition.tsx), [tests](https://bit.dev/learn-bit-react/theming/themes/dark-theme/~code/dark-theme.spec.tsx) and [docs](https://bit.dev/learn-bit-react/theming/themes/dark-theme/~code/dark-theme.docs.mdx).

## Step 4: Use your Theme in a Component

1. Import the Theme from the ThemeProvider component you created as well as the DarkTheme and any components you want to render.

```js
import React from 'react'
import { Theme } from '@learn-bit-react/theming.themes.theme-provider'
import { DarkTheme } from '@learn-bit-react/theming.themes.dark-theme'
import { Button } from '@learn-bit-react/theming.example.button'
```

Wrap all components in the Theme Provider component and use the overrides prop to change the theme to darkTheme.

```js
export const MyApp = () => {
  return (
    <Theme.ThemeProvider overrides={darkTheme}>
      <Button>Hello</Button>
    </Theme.ThemeProvider>
  )
}
```

### Button with Dark Theme applied

Use theme like a wrapper component You can alternatively use the component like this which will work exactly the same as the example above.

```js
export const MyApp = () => {
  return (
    <DarkTheme>
      <Button>Dark Theme</Button>
    </DarkTheme>
  )
}
```

### Multiple Themes

You can also use the default theme and have a part of your app be wrapped in a different theme.

```js
export const MyApp = () => {
  return (
    <Theme.ThemeProvider>
      <Button>Default Theme</Button>
      {/* A dark themed button inside a default theme */}
      <DarkTheme>
        <Button>Dark Theme</Button>
      </DarkTheme>
    </Theme.ThemeProvider>
  )
}
```

## Conclusion

And thats how you do theming in React. For more info on how the components work or to learn more on theming and React context check out:

- [Theming in Bit](https://bit.dev/learn-bit-react/theming/readme)
- [Example Button Component](https://bit.dev/learn-bit-react/theming/example/button)
- [Theme Provider Component](https://bit.dev/learn-bit-react/theming/themes/theme-provider)
- [Dark Theme](https://bit.dev/learn-bit-react/theming/themes/dark-theme).
- [React Docs Theming](https://beta.reactjs.org/apis/usecontext)
