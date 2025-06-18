import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { u as useHead } from './server.mjs';
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
import './TagsList.vue2.mjs';

const title = "Podcast Interviews";
const description = "Here's a list of all my podcast interviews";
const section = "podcasts";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: podcasts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "podcasts",
      () => queryCollection("podcasts").order("date", "DESC").all()
    )), __temp = await __temp, __restore(), __temp);
    useHead({
      title,
      meta: [{ name: "description", content: description }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageLayout = _sfc_main$1;
      const _component_ItemList = _sfc_main$2;
      _push(ssrRenderComponent(_component_PageLayout, mergeProps({
        title,
        description,
        section
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(podcasts) !== null) {
              _push2(ssrRenderComponent(_component_ItemList, {
                list: unref(podcasts),
                section
              }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(podcasts) !== null ? (openBlock(), createBlock(_component_ItemList, {
                key: 0,
                list: unref(podcasts),
                section
              }, null, 8, ["list"])) : createCommentVNode("", true)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/podcasts/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue5.mjs.map
