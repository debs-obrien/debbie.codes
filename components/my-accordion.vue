<template>
  <div class="p-4">
    <h1 class="text-4xl">Accordion</h1>

    <div v-for="accordion in accordions" :key="accordion.title">
      <BaseAccordian>
        <template v-slot:title>
          {{ accordion.title }}
        </template>

        <template v-slot:content>
          <div class="mb-10">
            {{ accordion.text }}
          </div>
        </template>
      </BaseAccordian>
    </div>
  </div>
</template>
<script>
import BaseAccordian from '@/components/_base-accordion'

export default {
  components: {
    BaseAccordian,
  },
  data() {
    return {
      accordions: [
        {
          title: 'Vue',
          text: 'All about Vue',
        },
        {
          title: 'Nuxt',
          text: 'All about Nuxt',
        },
        {
          title: 'webpack',
          text: 'All about webpack',
        },
      ],
    }
  },
}
</script>
