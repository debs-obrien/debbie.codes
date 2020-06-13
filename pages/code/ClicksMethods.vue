<template>
  <div class="flex sm:flex-row flex-col justify-center mb-4">
    <div class="sm:w-full md:w-1/3 p-2">
      <AdultCounter />
    </div>
    <div class="sm:w-full md:w-1/3 p-2">
      <MyDropdown />
    </div>
    <div class="sm:w-full md:w-1/3 p-2">
      <MyAccordion />
    </div>
  </div>
</template>
<script>
import AdultCounter from '@/components/AdultCounter'
import MyDropdown from '@/components/MyDropdown'
import MyAccordion from '@/components/MyAccordion'

export default {
  components: {
    AdultCounter,
    MyDropdown,
    MyAccordion
  },
  data () {
    return {}
  }
}
</script>
