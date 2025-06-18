import { mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, b as _sfc_main$1 } from './server.mjs';

const _sfc_main = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtImg = _sfc_main$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16 max-w-4xl text-center m-auto max-w-4xl" }, _attrs))}><div class="w-full xl:w-1/2 relative pb-12 lg:pb-0"><h1 class="my-2 font-bold text-2xl"> Ooops looks like that page doesn&#39;t exist </h1><p class="my-2"> Sorry about that Try choosing a different category from the list above go. </p></div>`);
  _push(ssrRenderComponent(_component_NuxtImg, {
    provider: "cloudinary",
    src: "v1668347473/debbie.codes/broken_vktobk.png",
    alt: "broken connection",
    width: "325",
    height: "200",
    format: "webp"
  }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/tags/NotFound.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_4 = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { __nuxt_component_4 as _ };
//# sourceMappingURL=NotFound.vue.mjs.map
