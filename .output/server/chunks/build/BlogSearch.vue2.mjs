import { defineComponent, ref, withAsyncContext, computed, watch, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr } from 'vue/server-renderer';
import { u as useAsyncData, q as queryCollection } from './app.mjs';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "BlogSearch",
  __ssrInlineRender: true,
  props: {
    articles: {},
    showImages: { type: Boolean }
  },
  emits: ["update:filteredArticles"],
  async setup(__props, { emit: __emit }) {
    let __temp, __restore;
    const props = __props;
    const emit = __emit;
    const searchQuery = ref("");
    const { data: titleResults } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "title-search",
      () => queryCollection("blog").where("title", "LIKE", `%${searchQuery.value}%`).order("date", "DESC").all(),
      {
        watch: [searchQuery],
        immediate: false
      }
    )), __temp = await __temp, __restore(), __temp);
    const { data: tagResults } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "tag-search",
      () => queryCollection("blog").where("tags", "LIKE", `%${searchQuery.value}%`).order("date", "DESC").all(),
      {
        watch: [searchQuery],
        immediate: false
      }
    )), __temp = await __temp, __restore(), __temp);
    const filteredArticles = computed(() => {
      if (!searchQuery.value) return props.articles;
      const titleMatches = titleResults.value || [];
      const tagMatches = tagResults.value || [];
      const paths = /* @__PURE__ */ new Set();
      const results = [];
      titleMatches.forEach((article) => {
        if (article.path) {
          paths.add(article.path);
          results.push(article);
        }
      });
      tagMatches.forEach((article) => {
        if (article.path && !paths.has(article.path)) {
          results.push(article);
        }
      });
      return results;
    });
    watch(filteredArticles, (newValue) => {
      emit("update:filteredArticles", newValue);
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto mb-8" }, _attrs))}><div class="relative"><input${ssrRenderAttr("value", unref(searchQuery))} type="search" placeholder="Search articles..." class="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white dark:bg-gray-800"><div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"><svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd"></path></svg></div></div></div>`);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=BlogSearch.vue2.mjs.map
