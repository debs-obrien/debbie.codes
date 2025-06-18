import { defineComponent, mergeProps } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _sfc_main$2 } from './Date.vue2.mjs';
import { _ as _sfc_main$3 } from './TagsList.vue2.mjs';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "VideoCard",
  __ssrInlineRender: true,
  props: {
    item: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Date = _sfc_main$2;
      const _component_TagsList = _sfc_main$3;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "flex flex-col overflow-hidden flex-1 max-width h-full" }, _attrs))}><div class="h-full rounded-xl shadow-cla-blue bg-gradient-to-r from-indigo-50 to-blue-50 overflow-hidden"><lite-youtube${ssrRenderAttr("videoid", _ctx.item.video)}${ssrRenderAttr("playlabel", _ctx.item.title)}${ssrRenderAttr("start", _ctx.item.start ? _ctx.item.start : 0)}></lite-youtube><div class="p-6">`);
      _push(ssrRenderComponent(_component_Date, {
        date: _ctx.item.date
      }, null, _parent));
      _push(`<p class="text-base font-medium text-gray-600 mb-3">${ssrInterpolate(_ctx.item.conference)}${ssrInterpolate(_ctx.item.host)}</p><h3 class="my-3 text-base leading-6 text-gray-500">${ssrInterpolate(_ctx.item.title)}</h3>`);
      _push(ssrRenderComponent(_component_TagsList, {
        tags: _ctx.item.tags,
        section: "videos"
      }, null, _parent));
      _push(`</div></div></article>`);
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "VideoList",
  __ssrInlineRender: true,
  props: {
    list: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VideoCard = _sfc_main$1;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "mt-12 grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 md:max-w-none" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.list, (video) => {
        _push(`<li data-test-id="interviews">`);
        _push(ssrRenderComponent(_component_VideoCard, { item: video }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});

export { _sfc_main as _ };
//# sourceMappingURL=VideoList.vue2.mjs.map
