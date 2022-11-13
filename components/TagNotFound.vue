<template>
  <div
    class="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16 mb-16"
  >
    <div class="w-full xl:w-1/2 relative pb-12 lg:pb-0">
      <div class="">
        <h1 class="my-2 font-bold text-2xl">
          Ooops looks like that page doesn't exist
        </h1>
        <p class="my-2">
          Sorry about that Try choosing a different category from the list above
          go.
        </p>
      </div>
    </div>
    <div>
      <NuxtImg
        provider="cloudinary"
        src="v1668347473/debbie.codes/broken_vktobk.png"
        alt="broken connection"
        width="444"
        height="256"
        sizes="sm:355px md:320px lg:480px"
      />
    </div>
  </div>
</template>
