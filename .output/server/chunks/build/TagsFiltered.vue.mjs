import { mergeProps, useSSRContext, defineComponent, withAsyncContext, withCtx, createTextVNode, unref, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrRenderList, ssrInterpolate } from 'vue/server-renderer';
import { _ as _export_sfc, a as __nuxt_component_0$1 } from './server.mjs';
import { r as replaceHyphen } from './TagsList.vue2.mjs';
import { u as useAsyncData, q as queryCollection } from './app.mjs';

const _sfc_main$2 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<h1${ssrRenderAttrs(mergeProps({ class: "text-center mb-4 text-4xl font-extrabold leading-10 tracking-tight sm:text-5xl sm:leading-none md:text-6xl capitalize" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
    _push(`Title`);
  }, _push, _parent);
  _push(`</h1>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppTitle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$1]]);

const _sfc_main$1 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<!--[--><p class="font-sans text-base font-semibold xl:w-2/4 lg:w-3/4 mx-auto text-center">`);
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</p><div class="flex mt-6 justify-center"><div class="w-16 h-1 rounded-full bg-blue-600 inline-flex"></div></div><!--]-->`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppIntro.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender]]);

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TagsFiltered",
  __ssrInlineRender: true,
  props: {
    section: {}
  },
  async setup(__props) {
    let __temp, __restore;
    const props = __props;
    const flatten = (tags, key = "tags") => {
      const _tags = tags.map((tag) => {
        let _tag = tag;
        if (tag.tags) {
          const flattened = flatten(tag[key]);
          _tag = flattened;
        }
        return _tag;
      }).flat(1);
      return _tags;
    };
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(`tags-${props.section}`, () => queryCollection(props.section).select("tags").all())), __temp = await __temp, __restore(), __temp);
    const tagCounts = /* @__PURE__ */ new Map();
    if (Array.isArray(data.value)) {
      const allTags = flatten(data.value, "tags");
      allTags.forEach((tag) => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    }
    const articleTags = Array.from(tagCounts.entries()).filter(([_, count]) => props.section === "courses" || "videos").map(([tag]) => tag);
    const sortedArticleTags = articleTags.sort();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$1;
      _push(`<ul${ssrRenderAttrs(mergeProps({
        "aria-label": "topics",
        class: "max-w-4xl flex justify-left md:justify-center items-center gap-2 my-4 mx-0 md:mx-auto border border-transparent rounded-lg overflow-x-scroll md:overflow-visible flex-nowrap md:flex-wrap font-normal md:text-sm sm:text-xl text-white uppercase"
      }, _attrs))} data-v-359be87c><li class="flex gap-2 justify-center flex-nowrap" data-v-359be87c>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: `/${_ctx.section}`,
        class: "px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` All `);
          } else {
            return [
              createTextVNode(" All ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</li><!--[-->`);
      ssrRenderList(unref(sortedArticleTags), (tag, i) => {
        _push(`<li class="flex gap-2 justify-center flex-nowrap" data-v-359be87c>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/${_ctx.section}/tags/${tag}`,
          class: "px-2 py-0.5 bg-slate-600 rounded-md transition-all hover:-translate-y-0.5 hover:bg-blue-500 whitespace-nowrap"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`${ssrInterpolate(("replaceHyphen" in _ctx ? _ctx.replaceHyphen : unref(replaceHyphen))(tag))}`);
            } else {
              return [
                createTextVNode(toDisplayString(("replaceHyphen" in _ctx ? _ctx.replaceHyphen : unref(replaceHyphen))(tag)), 1)
              ];
            }
          }),
          _: 2
        }, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tags/TagsFiltered.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-359be87c"]]);

export { __nuxt_component_0 as _, __nuxt_component_1 as a, __nuxt_component_2 as b };
//# sourceMappingURL=TagsFiltered.vue.mjs.map
