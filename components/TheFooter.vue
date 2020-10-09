<template>
  <footer class="flex flex-col mt-20 px-4 py-6">
    <div>
      <ColorModePicker />
      <div class="flex justify-center">
        <a href="https://www.buymeacoffee.com/debbieobrien" target="_blank">
          <img
            src="https://cdn.buymeacoffee.com/buttons/v2/arial-green.png"
            alt="Buy Me A Coffee"
            style="height: 60px !important;width: 217px !important;"
          />
        </a>
      </div>
    </div>
  </footer>
</template>
<script>
  import ColorModePicker from '@/components/ColorModePicker'

  export default {
    components: {
      ColorModePicker
    }
  }
</script>

<style scoped></style>
