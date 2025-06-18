import { a as __nuxt_component_0 } from './server.mjs';
import { defineComponent, mergeProps, withCtx, unref, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderList, ssrRenderComponent, ssrInterpolate } from 'vue/server-renderer';

function replaceHyphen(slug) {
  return String(slug).replaceAll("-", " ");
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "TagsList",
  __ssrInlineRender: true,
  props: {
    tags: {},
    section: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "text-sm text-blue-600 dark:text-blue-500 uppercase flex flex-wrap" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.tags, (tag) => {
        _push(`<li class="whitespace-nowrap">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: `/${_ctx.section}/tags/${tag}`,
          class: "hover:underline inline-block pr-2"
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

export { _sfc_main as _, replaceHyphen as r };
//# sourceMappingURL=TagsList.vue2.mjs.map
