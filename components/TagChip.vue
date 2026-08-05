<script setup lang="ts">
withDefaults(defineProps<{
  to: string
  label: string
  hash?: boolean
  active?: boolean
  variant?: 'pill' | 'text'
}>(), {
  hash: false,
  active: false,
  variant: 'pill',
})
</script>

<template>
  <NuxtLink
    :to="to"
    class="tag-chip"
    :class="[
      variant === 'pill' ? 'tag-chip--pill' : 'tag-chip--text',
      active && 'tag-chip--active',
    ]"
  >{{ hash ? `#${label}` : label }}</NuxtLink>
</template>

<style scoped>
.tag-chip {
  display: inline-flex;
  align-items: center;
  white-space: nowrap;
  font-weight: 500;
  transition: color 0.15s ease, background-color 0.15s ease, border-color 0.15s ease;
}

.tag-chip--pill {
  padding: 0.25rem 0.65rem;
  font-size: 0.75rem;
  border-radius: 9999px;
  border: 1px solid rgb(209 213 219);
  background: rgb(249 250 251);
  color: rgb(55 65 81);
}

.tag-chip--pill:hover {
  border-color: #d8002d;
  color: #d8002d;
  background: rgba(216, 0, 45, 0.06);
}

.dark .tag-chip--pill {
  border-color: rgb(55 65 81);
  background: rgba(15, 23, 42, 0.6);
  color: rgb(209 213 219);
}

.dark .tag-chip--pill:hover {
  border-color: #d8002d;
  color: #fff;
  background: rgba(216, 0, 45, 0.15);
}

.tag-chip--pill.tag-chip--active,
.tag-chip--pill.router-link-exact-active {
  border-color: #d8002d;
  background: #d8002d;
  color: #fff;
}

.tag-chip--text {
  font-size: 0.875rem;
  color: rgb(75 85 99);
}

.tag-chip--text:hover {
  color: #d8002d;
}

.dark .tag-chip--text {
  color: rgb(156 163 175);
}

.dark .tag-chip--text:hover {
  color: #fd213b;
}

.tag-chip--text.tag-chip--active,
.tag-chip--text.router-link-exact-active {
  color: #d8002d;
}
</style>
