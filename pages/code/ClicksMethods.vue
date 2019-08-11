<template>
  <div class="flex sm:flex-row flex-col justify-center mb-4 ">
    <div class="sm:w-full md:w-1/3 p-2"><AdultCounter /></div>
    <div class="sm:w-full md:w-1/3 p-2"><MyDropdown /></div>
    <div class="sm:w-full md:w-1/3 p-2"><MyAccordion /></div>
  </div>
</template>
<script>
import AdultCounter from '@/components/adult-counter'
import MyDropdown from '@/components/my-dropdown'
import MyAccordion from '@/components/my-accordion'

export default {
  components: {
    AdultCounter,
    MyDropdown,
    MyAccordion,
  },
  data() {
    return {}
  },
}
</script>
