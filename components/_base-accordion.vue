<template>
  <div>
    <div class="flex justify-between pt-4 cursor-pointer" @click="toggleItem">
      <h2 class="text-lg md:text-2xl font-medium">
        <slot name="title"></slot>
      </h2>
      +
    </div>

    <div v-show="show">
      <slot name="content"></slot>
    </div>
  </div>
</template>
<script>
export default {
  components: {},
  data: function() {
    return {
      show: false,
    }
  },
  methods: {
    toggleItem: function() {
      this.show = !this.show
    },
  },
}
</script>
