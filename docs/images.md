# Images

## Cloudinary

All our images are coming from cloudinary as this gives us an increased performance boost due to all images being stored on a CDN. Also by adding the q_auto and f_auto in every image they are automatically optimized for us and the right extesnsion is used depending on the browser.

## Lazy Loading

For lazy loading of images we have used the plugin [v-lazy-image](/plugins.md).

## Faded Image

To get the effects of images fading onto the page we have added an ImageFade component.

```js
<template functional>
  <v-lazy-image
    :src="props.src"
    :src-placeholder="props.srcPlaceholder"
    :alt="props.alt"
  ></v-lazy-image>
</template>

<style scoped>
.v-lazy-image {
  opacity: 0;
  transition: opacity 2s;
}
.v-lazy-image-loaded {
  opacity: 1;
}
</style>
```
