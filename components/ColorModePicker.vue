<template>
  <div class="text-center">
    <div>
      <ul>
        <li
          v-for="color of ['system', 'light', 'dark', 'sepia']"
          :key="color"
          :class="{
            preferred: !$colorMode.unknown && color === $colorMode.preference,
            selected: !$colorMode.unknown && color === $colorMode.value
          }"
        >
          <component
            :is="`icon-${color}`"
            @click="$colorMode.preference = color"
            :aria-label="`${color} mode`"
          />
        </li>
      </ul>
      <p>
        <ColorScheme placeholder="..." tag="span">
          Color mode: <b>{{ $colorMode.preference }}</b>
          <span v-if="$colorMode.preference === 'system'"
            >&nbsp;(<i>{{ $colorMode.value }}</i> mode detected)</span
          >
        </ColorScheme>
      </p>
    </div>
  </div>
</template>
<script setup>
  const colorMode = useColorMode()
  console.log(colorMode.preference)
</script>

<style scoped>
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
  ul li {
    display: inline-block;
    padding: 5px;
  }
  p {
    margin: 0;
    padding-top: 5px;
    padding-bottom: 20px;
  }
  .feather {
    position: relative;
    top: 0px;
    cursor: pointer;
    padding: 7px;
    background-color: var(--bg-secondary);
    border: 2px solid var(--border-color);
    margin: 0;
    border-radius: 5px;
    transition: all 0.1s ease;
    width: 40px;
    height: 40px;
    will-change: transform;
    transform: translateZ(0);
  }
  .feather:hover {
    top: -3px;
  }
  .feather.preferred {
    border-color: var(--color-primary);
    top: -3px;
  }
  .feather.selected {
    color: var(--color-primary);
  }
</style>
