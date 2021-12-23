---
title: Tailwind in Bit
date: 2021-12-23
description: How to add Tailwind to your Bit components so you can not only build with Bit but also see the styles in your compositions.
image: blog/Screenshot_2020-12-31_at_18.14.59_sbfsen
provider: cloudinary
tags: [Architecture, Bit, React, all]
published: false
---

Tailwind is one of my favourite ways to build CSS especially when creating demo projects or needing to quickly add styles t see something working. Many people have different opinions about Tailwind so just use what you prefer. I use a mix as depending on what I am building some things might be in Tailwind and others not. When building your components with Tailwind in Bit it is a good idea to add a `tailwind` label so others who choose to use these component will know that they require tailwind in order for styles to work.

## Adding Tailwind to the Env

As my components all have a custom environment I now need to add tailwind support to this environment so that my compositions in Bit will render with Tailwind. Compositions allow us to build components in isolation as if they were their own min app.

In the Env component add a tailwind folder with a styles.css file and add in the following

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Then add a tailwind.config.js file

```json
module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
      spacing: {
        16: "1.6rem",
        20: "2rem",
      },
      extend: {
        spacing: {
          16: "1.6rem",
          20: "2rem",
        },
      },
    },
    variants: {
      extend: {},
    },
    plugins: [],
  };
```

We need to install the webpack-transformer component from Bit which we will then add to our env component.

```jsx
@bit-foundations/styling.tailwind.webpack-transformer
```

In your environment component add the following to the main.runtime.ts file

```jsx
import { UseTailwindTransformer } from '@bit-foundations/styling.tailwind.webpack-transformer'
import { tailwindConfigPath } from '@your-org/your-scope.tailwind.configs.tailwind-config'
```

Then inside the provider add the following code

```jsx
static async provider([react, envs]: [ReactMain, EnvsMain]) {
const {
      previewConfigTransformer: twPreviewTransformer,
      devServerConfigTransformer: twDevServerTransformer
    } = UseTailwindTransformer(tailwindConfigPath);
...
}
```

Then inside your envs where you override files for TypScript, webpack, Jest etc add in the following code to use the TailwindPreview and DevServer Transformers

```jsx
const MyEnv = envs.compose(react.reactEnv, [
      /**
       * Uncomment to override the config files for TypeScript, Webpack or Jest
       * Your config gets merged with the defaults
       */

      react.useWebpack({
        previewConfig: [twPreviewTransformer],
        devServerConfig: [twDevServerTransformer]
      }),
```

Then in the preview.runtime.ts file of your env import the tailwind config

```jsx
import '@learn-bit-react/base-ui.configs.tailwind-config/styles.css'
```

For the tailwind config component we create a new component and in the index.ts file we require the styles file as well as the tailwind config file with the path and then export them.

```jsx
const styles = require('./styles.css')
const tailwindConfig = require('./tailwind.config')
const tailwindConfigPath = require.resolve('./tailwind.config')
export { styles, tailwindConfig, tailwindConfigPath }
```

In styles.css we add in the tailwind styles

```jsx
@tailwind base;
@tailwind components;
@tailwind utilities;
```

In the tailwind config we add in the config

```jsx
module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    spacing: {
      16: '1.6rem',
      20: '2rem'
    },
    extend: {
      spacing: {
        16: '1.6rem',
        20: '2rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
```

[button styled with Tailwind in Bit](https://bit.dev/learn-bit-react/base-ui/ui/button/~compositions)
