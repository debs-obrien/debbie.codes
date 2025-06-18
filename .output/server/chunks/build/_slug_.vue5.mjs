import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_2 } from './TagsFiltered.vue.mjs';
import { _ as __nuxt_component_4 } from './NotFound.vue.mjs';
import { defineComponent, withAsyncContext, withCtx, createTextVNode, toDisplayString, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';
import { c as useRoute, u as useHead } from './server.mjs';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { r as replaceHyphen } from './TagsList.vue2.mjs';
import { _ as _sfc_main$1 } from './ItemList.vue2.mjs';
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

const section = "podcasts";
const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const {
      params: { slug }
    } = useRoute();
    const { data: podcasts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      `podcasts-${slug}`,
      () => queryCollection("podcasts").where("tags", "LIKE", `%${slug}%`).order("date", "DESC").all()
    )), __temp = await __temp, __restore(), __temp);
    const topic = replaceHyphen(slug);
    const title = `Podcast Interviews on ${topic}`;
    const description = `Here's a list of all my podcast interviews with the ${topic} tag`;
    useHead({
      title,
      meta: [{ name: "description", content: description }]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppTitle = __nuxt_component_0;
      const _component_AppIntro = __nuxt_component_1;
      const _component_TagsFiltered = __nuxt_component_2;
      const _component_ItemList = _sfc_main$1;
      const _component_TagsNotFound = __nuxt_component_4;
      _push(`<main${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(_component_AppTitle, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(title))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_AppIntro, null, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(description)}`);
          } else {
            return [
              createTextVNode(toDisplayString(description))
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_TagsFiltered, { section }, null, _parent));
      if (unref(podcasts) !== null) {
        _push(ssrRenderComponent(_component_ItemList, {
          list: unref(podcasts),
          section
        }, null, _parent));
      } else {
        _push(ssrRenderComponent(_component_TagsNotFound, null, null, _parent));
      }
      _push(`</main>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/podcasts/tags/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_.vue5.mjs.map
