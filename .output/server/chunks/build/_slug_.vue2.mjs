import { _ as __nuxt_component_4 } from './NotFound.vue.mjs';
import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { c as useRoute, u as useHead } from './server.mjs';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { r as replaceHyphen } from './TagsList.vue2.mjs';
import { _ as _sfc_main$1 } from './PageLayout.vue2.mjs';
import { _ as _sfc_main$2 } from './ItemList.vue2.mjs';
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

const section = "blog";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const {
      params: { slug }
    } = useRoute();
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `articles-${slug}`,
      () => queryCollection("blog").where("tags", "LIKE", `%${slug}%`).order("date", "DESC").all()
    )), __temp = await __temp, __restore(), __temp);
    const topic = replaceHyphen(slug);
    const title = `Blog Posts on ${topic}`;
    const description = `Here's a list of all my blog posts with the ${topic} tag`;
    useHead({
      title,
      meta: [{ name: "description", content: description }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageLayout = _sfc_main$1;
      const _component_ItemList = _sfc_main$2;
      const _component_TagsNotFound = __nuxt_component_4;
      _push(ssrRenderComponent(_component_PageLayout, mergeProps({
        title,
        description,
        section
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(articles) !== null) {
              _push2(ssrRenderComponent(_component_ItemList, {
                list: unref(articles),
                section
              }, null, _parent2, _scopeId));
            } else {
              _push2(ssrRenderComponent(_component_TagsNotFound, null, null, _parent2, _scopeId));
            }
          } else {
            return [
              unref(articles) !== null ? (openBlock(), createBlock(_component_ItemList, {
                key: 0,
                list: unref(articles),
                section
              }, null, 8, ["list"])) : (openBlock(), createBlock(_component_TagsNotFound, { key: 1 }))
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/tags/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_.vue2.mjs.map
