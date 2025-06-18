import { defineComponent, mergeProps, withCtx, createVNode, toDisplayString, withAsyncContext, unref, createBlock, openBlock, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrInterpolate, ssrRenderAttr } from 'vue/server-renderer';
import { f as formatDate, _ as _sfc_main$2 } from './Date.vue2.mjs';
import { a as __nuxt_component_0, c as useRoute, u as useHead, b as _sfc_main$3 } from './server.mjs';
import { u as useAsyncData, q as queryCollection, a as queryCollectionItemSurroundings } from './app.mjs';
import { _ as _sfc_main$4 } from './ContentRenderer.vue2.mjs';
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
import 'property-information';

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "PrevNext",
  __ssrInlineRender: true,
  props: {
    prev: {},
    next: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "flex gap-4 justify-between p-4 mt-6 border border-slate-200 rounded-lg" }, _attrs))}><div class="prev">`);
      if (_ctx.prev) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: _ctx.prev.path
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>${ssrInterpolate(_ctx.prev.title)}</span>`);
            } else {
              return [
                createVNode("span", null, toDisplayString(_ctx.prev.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="next">`);
      if (_ctx.next) {
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: _ctx.next.path
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(`<span${_scopeId}>${ssrInterpolate(_ctx.next.title)}</span>`);
            } else {
              return [
                createVNode("span", null, toDisplayString(_ctx.next.title), 1)
              ];
            }
          }),
          _: 1
        }, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "[slug]",
  __ssrInlineRender: true,
  async setup(__props) {
    var _a, _b, _c, _d, _e, _f;
    let __temp, __restore;
    const { path } = useRoute();
    const { data: article } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      path.replace(/\/$/, ""),
      () => queryCollection("blog").where("path", "LIKE", path).first(),
      "$fhvmE-Di65"
    )), __temp = await __temp, __restore(), __temp);
    const { data } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("surround", () => {
      return queryCollectionItemSurroundings("blog", path).order("date", "DESC");
    })), __temp = await __temp, __restore(), __temp);
    const [prev, next] = data.value || [];
    const title = ((_a = article.value) == null ? void 0 : _a.title) || "";
    const description = ((_b = article.value) == null ? void 0 : _b.description) || "";
    const image = ((_c = article.value) == null ? void 0 : _c.image) || "";
    const ogImage = ((_d = article.value) == null ? void 0 : _d.ogimage) || "";
    const formattedDate = formatDate(((_e = article.value) == null ? void 0 : _e.date) || "");
    useHead({
      title: ((_f = article.value) == null ? void 0 : _f.title) || "",
      meta: [
        { name: "description", content: description },
        // Test on: https://developers.facebook.com/tools/debug/ or https://socialsharepreview.com/
        { property: "og:site_name", content: "Debbie Codes" },
        { property: "og:type", content: "website" },
        {
          property: "og:url",
          content: "https://debbie.codes"
        },
        {
          property: "og:title",
          content: title
        },
        {
          property: "og:description",
          content: description
        },
        {
          property: "og:image",
          content: ogImage || image
        },
        // Test on: https://cards-dev.twitter.com/validator or https://socialsharepreview.com/
        { name: "twitter:site", content: "@debs_obrien" },
        { name: "twitter:card", content: "summary_large_image" },
        {
          name: "twitter:url",
          content: "https://debbie.codes"
        },
        {
          name: "twitter:title",
          content: title
        },
        {
          name: "twitter:description",
          content: description
        },
        {
          name: "twitter:image",
          content: ogImage || image
        }
      ],
      link: [
        {
          rel: "canonical",
          href: `https://debbie.codes/${path}`
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Date = _sfc_main$2;
      const _component_NuxtImg = _sfc_main$3;
      const _component_ContentRenderer = _sfc_main$4;
      const _component_BlogPrevNext = _sfc_main$1;
      _push(`<main${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 sm:px-6 max-w-5xl" }, _attrs))}>`);
      if (unref(article) !== null) {
        _push(`<article>`);
        if (unref(article)) {
          _push(`<header class="py-4 sm:py-6 text-center"><h1 class="font-extrabold text-2xl sm:text-3xl lg:text-5xl mb-2 sm:mb-3">${ssrInterpolate(unref(article).title)}</h1>`);
          _push(ssrRenderComponent(_component_Date, { date: unref(formattedDate) }, null, _parent));
          _push(`</header>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<div class="rounded mb-4 sm:mb-6 overflow-hidden object-cover object-center max-w-xl mx-auto">`);
        _push(ssrRenderComponent(_component_NuxtImg, {
          provider: unref(article).provider,
          src: unref(article).image,
          alt: unref(article).title,
          width: "600",
          height: "300",
          fit: "cover",
          format: "webp",
          class: "rounded center mx-auto w-full"
        }, null, _parent));
        _push(`</div><div class="prose mx-auto max-w-4xl mb-16 sm:mb-20 lg:mb-24 break-words">`);
        _push(ssrRenderComponent(_component_ContentRenderer, {
          value: unref(article),
          class: "text-base sm:text-lg font-normal"
        }, {
          empty: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              if (unref(article).url) {
                _push2(`<a${ssrRenderAttr("href", unref(article).url)} target="_blank" rel="noopener noreferrer" class="flex items-center justify-center w-full text-primary hover:text-primary/80 transition-colors py-4"${_scopeId}><span${_scopeId}>Read on external site</span><span class="ml-1"${_scopeId}>→</span></a>`);
              } else {
                _push2(`<p${_scopeId}>No content found.</p>`);
              }
            } else {
              return [
                unref(article).url ? (openBlock(), createBlock("a", {
                  key: 0,
                  href: unref(article).url,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  class: "flex items-center justify-center w-full text-primary hover:text-primary/80 transition-colors py-4"
                }, [
                  createVNode("span", null, "Read on external site"),
                  createVNode("span", { class: "ml-1" }, "→")
                ], 8, ["href"])) : (openBlock(), createBlock("p", { key: 1 }, "No content found."))
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div>`);
        _push(ssrRenderComponent(_component_BlogPrevNext, {
          prev: unref(prev),
          next: unref(next)
        }, null, _parent));
        _push(`</article>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</main>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/[slug].vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=_slug_.vue.mjs.map
