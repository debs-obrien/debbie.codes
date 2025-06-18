import { defineComponent, withAsyncContext, mergeProps, withCtx, unref, createBlock, createCommentVNode, openBlock, useSSRContext } from 'vue';
import { ssrRenderComponent } from 'vue/server-renderer';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { u as useHead } from './server.mjs';
import { _ as _sfc_main$1 } from './PageLayout.vue2.mjs';
import { _ as _sfc_main$2 } from './VideoList.vue2.mjs';
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
import './Date.vue2.mjs';

const title = "Videos";
const description = "Videos from conference talks, interviews and live streams";
const section = "videos";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: videos } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "videos",
      () => queryCollection("videos").order("date", "DESC").all()
    )), __temp = await __temp, __restore(), __temp);
    useHead({
      title,
      meta: [{ name: "description", content: description }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_PageLayout = _sfc_main$1;
      const _component_VideoList = _sfc_main$2;
      _push(ssrRenderComponent(_component_PageLayout, mergeProps({
        title,
        description,
        section
      }, _attrs), {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            if (unref(videos) !== null) {
              _push2(ssrRenderComponent(_component_VideoList, { list: unref(videos) }, null, _parent2, _scopeId));
            } else {
              _push2(`<!---->`);
            }
          } else {
            return [
              unref(videos) !== null ? (openBlock(), createBlock(_component_VideoList, {
                key: 0,
                list: unref(videos)
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
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/videos/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=index.vue3.mjs.map
