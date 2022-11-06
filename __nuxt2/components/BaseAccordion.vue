<template>
  <div>
    <div class="flex justify-between pt-4 cursor-pointer" @click="toggleItem">
      <h2 class="text-lg md:text-2xl font-medium">
        <slot name="title" />
      </h2>
      <span>+</span>
    </div>
    <div v-show="show">
      <slot name="content" />
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data () {
    return {
      show: false
    }
  },
  methods: {
    toggleItem () {
      this.show = !this.show
    }
  }
}
</script>
