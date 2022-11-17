import type { RouterConfig } from '@nuxt/schema'
export default <RouterConfig>{
  scrollBehavior() {
    return { top: 0 }
  },
}
