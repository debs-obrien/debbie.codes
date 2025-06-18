import { _ as __nuxt_component_0, a as __nuxt_component_1, b as __nuxt_component_2 } from './TagsFiltered.vue.mjs';
import { defineComponent, mergeProps, withCtx, createTextVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderSlot } from 'vue/server-renderer';

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "PageLayout",
  __ssrInlineRender: true,
  props: {
    title: {},
    description: {},
    section: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_AppTitle = __nuxt_component_0;
      const _component_AppIntro = __nuxt_component_1;
      const _component_TagsFiltered = __nuxt_component_2;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "px-4 sm:px-6" }, _attrs))}>`);
      if (_ctx.title || _ctx.description) {
        _push(`<header>`);
        if (_ctx.title) {
          _push(ssrRenderComponent(_component_AppTitle, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.title)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.title), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (_ctx.description) {
          _push(ssrRenderComponent(_component_AppIntro, null, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(_ctx.description)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(_ctx.description), 1)
                ];
              }
            }),
            _: 1
          }, _parent));
        } else {
          _push(`<!---->`);
        }
        if (_ctx.section) {
          _push(ssrRenderComponent(_component_TagsFiltered, { section: _ctx.section }, null, _parent));
        } else {
          _push(`<!---->`);
        }
        _push(`</header>`);
      } else {
        _push(`<!---->`);
      }
      ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
      _push(`</main>`);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=PageLayout.vue2.mjs.map
