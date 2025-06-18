import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { a as __nuxt_component_0, b as _sfc_main$2 } from './server.mjs';
import { _ as _sfc_main$3 } from './TagsList.vue2.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "Item",
  __ssrInlineRender: true,
  props: {
    item: {},
    section: {},
    showImages: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$2;
      const _component_TagsList = _sfc_main$3;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "grid grid-cols-4 gap-6 auto-cols-[minmax(0,_3fr)] py-4" }, _attrs))}>`);
      if (_ctx.showImages !== false) {
        _push(`<div class="h-full w-full object-cover">`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: _ctx.item.url || _ctx.item.path,
          target: _ctx.item.url ? "_blank" : "_self"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(ssrRenderComponent(_component_NuxtImg, {
                provider: _ctx.item.provider,
                src: _ctx.item.image,
                alt: _ctx.item.title,
                width: "272",
                height: "272",
                fit: "thumb",
                format: "webp",
                class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
              }, null, _parent2, _scopeId));
            } else {
              return [
                createVNode(_component_NuxtImg, {
                  provider: _ctx.item.provider,
                  src: _ctx.item.image,
                  alt: _ctx.item.title,
                  width: "272",
                  height: "272",
                  fit: "thumb",
                  format: "webp",
                  class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
                }, null, 8, ["provider", "src", "alt"])
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="${ssrRenderClass({ "col-span-4": _ctx.showImages === false, "col-span-3": _ctx.showImages !== false })}">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.url || _ctx.item.path,
        target: _ctx.item.url ? "_blank" : "_self"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h2 class="mb-0 lg:mb-4 text-lg md:text-3xl font-semibold text-gray-800 hover:underline dark:text-white"${_scopeId}>${ssrInterpolate(_ctx.item.title)}</h2><p class="mt-0 lg:mt-3 mb-3 text-base lg:text-base text-gray-500 dark:text-gray-300 md:text-sm overflow-hidden md:overflow-visible whitespace-nowrap md:whitespace-normal text-ellipsis"${_scopeId}>${ssrInterpolate(_ctx.item.description)}</p>`);
          } else {
            return [
              createVNode("h2", { class: "mb-0 lg:mb-4 text-lg md:text-3xl font-semibold text-gray-800 hover:underline dark:text-white" }, toDisplayString(_ctx.item.title), 1),
              createVNode("p", { class: "mt-0 lg:mt-3 mb-3 text-base lg:text-base text-gray-500 dark:text-gray-300 md:text-sm overflow-hidden md:overflow-visible whitespace-nowrap md:whitespace-normal text-ellipsis" }, toDisplayString(_ctx.item.description), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      if (_ctx.item.tags) {
        _push(ssrRenderComponent(_component_TagsList, {
          tags: _ctx.item.tags,
          section: _ctx.section
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></article>`);
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "ItemList",
  __ssrInlineRender: true,
  props: {
    list: {},
    section: {},
    showImages: { type: Boolean }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Item = _sfc_main$1;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "py-6 m-auto max-w-4xl" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.list, (item) => {
        _push(`<li class="py-4 border-b">`);
        _push(ssrRenderComponent(_component_Item, {
          item,
          section: _ctx.section,
          showImages: _ctx.showImages
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=ItemList.vue2.mjs.map
