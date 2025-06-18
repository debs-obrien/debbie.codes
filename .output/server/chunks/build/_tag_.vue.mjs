import { defineComponent, withAsyncContext, ref, mergeProps, withCtx, unref, isRef, createVNode, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { c as useRoute, u as useHead } from './server.mjs';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { _ as _sfc_main$1 } from './PageLayout.vue2.mjs';
import { _ as _sfc_main$2 } from './BlogSearch.vue2.mjs';
import { _ as _sfc_main$3 } from './ItemList.vue2.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'consola';
import 'node:url';
import 'better-sqlite3';
import 'ipx';
import 'vue-router';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'unhead/utils';
import 'devalue';
import 'unhead/plugins';
import './TagsFiltered.vue.mjs';
import './TagsList.vue2.mjs';

const section = "blog";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[tag]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { tag } = useRoute().params;
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "articles",
      () => queryCollection("blog").where("tags", "LIKE", `%${tag}%`).order("date", "DESC").all()
    )), __temp = await __temp, __restore(), __temp);
    const filteredArticles = ref([]);
    const title = `Blog Posts tagged with ${tag}`;
    const description = `Here's a list of all my blog posts tagged with ${tag}`;
    useHead({
      title,
      meta: [{ name: "description", content: description }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageLayout = _sfc_main$1;
      const _component_BlogSearch = _sfc_main$2;
      const _component_ItemList = _sfc_main$3;
      _push(ssrRenderComponent(_component_PageLayout, mergeProps({
        title,
        description,
        section
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_BlogSearch, {
              articles: unref(articles) || [],
              filteredArticles: unref(filteredArticles),
              "onUpdate:filteredArticles": ($event) => isRef(filteredArticles) ? filteredArticles.value = $event : null
            }, null, _parent2, _scopeId));
            if (unref(filteredArticles).length > 0) {
              _push2(ssrRenderComponent(_component_ItemList, {
                list: unref(filteredArticles),
                section
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<div class="text-center py-8"${_scopeId}><p class="text-gray-600"${_scopeId}>No articles found matching your search.</p></div>`);
            }
          } else {
            return [
              createVNode(_component_BlogSearch, {
                articles: unref(articles) || [],
                filteredArticles: unref(filteredArticles),
                "onUpdate:filteredArticles": ($event) => isRef(filteredArticles) ? filteredArticles.value = $event : null
              }, null, 8, ["articles", "filteredArticles", "onUpdate:filteredArticles"]),
              unref(filteredArticles).length > 0 ? (openBlock(), createBlock(_component_ItemList, {
                key: 0,
                list: unref(filteredArticles),
                section
              }, null, 8, ["list"])) : (openBlock(), createBlock("div", {
                key: 1,
                class: "text-center py-8"
              }, [
                createVNode("p", { class: "text-gray-600" }, "No articles found matching your search.")
              ]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/tags/[tag].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_tag_.vue.mjs.map
