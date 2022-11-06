<template>
  <div class="gradient text-white min-h-screen flex items-center">
    <div class="mx-auto p-4 flex flex-col justify-center">
      <div class="text-6xl font-medium mb-8">
        Thanks, I will be in touch soon
      </div>

      <div class="text-center">
        <NuxtLink to="/" class="border border-white rounded p-4 mt-8">
          Go Home
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<style>
  .gradient {
    background-image: linear-gradient(135deg, #684ca0 35%, #1c4ca0 100%);
  }
</style>
