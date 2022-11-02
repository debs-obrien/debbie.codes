<template>
  <div class="">
    <TheTopBar />
    <div class="container mt-top-bar">
      <NuxtPage />
    </div>
    <ColorModePicker class="flex flex-col mt-20 px-4 py-6" />
    <TheFooter />
  </div>
</template>

<style>
  .dark .prose blockquote {
    color: #fff;
  }
</style>
