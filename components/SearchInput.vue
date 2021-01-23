<template>
  <div class="w-full relative flex flex-col justify-between">
    <div
      class="w-full relative"
      @keydown.down="increment"
      @keydown.up="decrement"
      @keydown.enter="go"
    >
      <label for="search" class="sr-only">Search</label>
      <div class="relative">
        <div
          class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
        >
          <IconSearch class="h-5 w-5 text-gray-500" />
        </div>
        <input
          id="search"
          ref="search"
          v-model="q"
          class="block w-full pl-10 pr-3 py-2 truncate leading-5 placeholder-gray-500 border border-transparent text-gray-700 focus:border-gray-300 rounded-md focus:outline-none focus:bg-red "
          :class="{ 'rounded-b-none': focus && results.length }"
          placeholder="search"
          type="search"
          autocomplete="off"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>
    </div>
    <ul
      v-show="focus && (searching || results.length)"
      class="z-10 absolute w-full flex-1 top-0 bg-white rounded-md border border-gray-300 overflow-hidden"
      :class="{ 'rounded-t-none': focus && results.length }"
      style="margin-top: 37px;"
    >
      <li v-if="searching && !results.length" class="px-4 py-2">
        Searching...
      </li>
      <li
        v-for="(result, index) of results"
        :key="result.slug"
        @mouseenter="focusIndex = index"
        @mousedown="go"
      >
        <NuxtLink
          :to="{
            name: 'blog-slug',
            params: { slug: result.slug !== 'index' ? result.slug : undefined }
          }"
          class="flex px-4 py-2 items-center leading-5 transition ease-in-out duration-150"
          :class="{
            'text-primary bg-gray-200': focusIndex === index
          }"
          @click="focus = false"
        >
          <span class="font-bold hidden sm:block">{{ result.category }}</span>
          <IconChevronRight class="w-3 h-3 mx-1 hidden sm:block" />
          {{ result.title }}
        </NuxtLink>
      </li>
    </ul>
  </div>
</template>

<script>
  import IconSearch from '@/assets/icons/search.svg?inline'
  import IconChevronRight from '@/assets/icons/chevron-right.svg?inline'
  export default {
    components: {
      IconSearch,
      IconChevronRight
    },
    props: {
      searchItem: {
        type: String,
        default: 'articles'
      }
    },
    data() {
      return {
        q: '',
        focus: false,
        focusIndex: -1,
        open: false,
        searching: false,
        results: []
      }
    },
    watch: {
      async q(q) {
        this.focusIndex = -1
        if (!q) {
          this.searching = false
          this.results = []
          return
        }
        this.searching = true
        this.results = await this.$content(this.searchItem)
          .sortBy('position', 'asc')
          .limit(12)
          .search(q)
          .fetch()
        this.searching = false
      }
    },
    mounted() {
      window.addEventListener('keyup', this.keyup)
    },
    beforeDestroy() {
      window.removeEventListener('keyup', this.keyup)
    },
    methods: {
      onFocus() {
        this.focus = true
        this.$emit('focus', true)
      },
      onBlur() {
        this.focus = false
        this.$emit('focus', false)
      },
      keyup(e) {
        if (e.key === '/') {
          this.$refs.search.focus()
        }
      },
      increment() {
        if (this.focusIndex < this.results.length - 1) {
          this.focusIndex++
        }
      },
      decrement() {
        if (this.focusIndex >= 0) {
          this.focusIndex--
        }
      },
      go() {
        if (this.results.length === 0) {
          return
        }
        const result =
          this.focusIndex === -1
            ? this.results[0]
            : this.results[this.focusIndex]
        const path = `/blog/${result.slug !== 'index' ? result.slug : ''}`
        this.$router.push(path)
        // Unfocus the input and reset the query.
        this.$refs.search.blur()
        this.q = ''
      }
    }
  }
</script>
