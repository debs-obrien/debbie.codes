import { mergeProps, useSSRContext, defineComponent, withCtx, createVNode, createTextVNode, toDisplayString, withAsyncContext, unref } from 'vue';
import { ssrRenderAttrs, ssrRenderSlot, ssrRenderComponent, ssrInterpolate, ssrRenderList } from 'vue/server-renderer';
import { _ as _export_sfc, a as __nuxt_component_0, b as _sfc_main$6 } from './server.mjs';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { _ as _sfc_main$7 } from './TagsList.vue2.mjs';
import { _ as _sfc_main$8 } from './Date.vue2.mjs';
import { _ as _sfc_main$9 } from './VideoList.vue2.mjs';
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

const _sfc_main$5 = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<h2${ssrRenderAttrs(mergeProps({ class: "font-sans text-center mt-16 text-3xl font-semibold sm:text-4xl sm:leading-none md:text-5xl" }, _attrs))}>`);
  ssrRenderSlot(_ctx.$slots, "default", {}, () => {
    _push(`Title`);
  }, _push, _parent);
  _push(`</h2>`);
}
const _sfc_setup$2 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AppSubtitle.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["ssrRender", _sfc_ssrRender$1]]);

const _sfc_main$4 = /* @__PURE__ */ defineComponent({
  __name: "FeaturedSection",
  __ssrInlineRender: true,
  props: {
    item: {},
    section: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$6;
      const _component_TagsList = _sfc_main$7;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-gray-900 container mx-auto my-5 p-5 lg:-mx-6 lg:flex lg:items-center" }, _attrs))}>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.path,
        "aria-label": _ctx.item.title
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              provider: _ctx.item.provider,
              src: _ctx.item.image,
              alt: _ctx.item.title,
              width: "680",
              height: "280",
              fit: "fill",
              format: "webp",
              class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                provider: _ctx.item.provider,
                src: _ctx.item.image,
                alt: _ctx.item.title,
                width: "680",
                height: "280",
                fit: "fill",
                format: "webp",
                class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
              }, null, 8, ["provider", "src", "alt"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="mt-6 lg:w-1/2 lg:mt-0 lg:mx-6">`);
      _push(ssrRenderComponent(_component_TagsList, {
        tags: _ctx.item.tags,
        section: "blog"
      }, null, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.path,
        class: "block mt-4 text-2xl font-semibold text-gray-800 hover:underline dark:text-white md:text-3xl"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(_ctx.item.title)}`);
          } else {
            return [
              createTextVNode(toDisplayString(_ctx.item.title), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<p class="mt-3 text-sm text-gray-500 dark:text-gray-300 md:text-sm">${ssrInterpolate(_ctx.item.description)}</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.path,
        "aria-label": `read more about ${_ctx.item.title}`,
        class: "inline-block mt-2 text-blue-600 dark:text-blue-500 underline hover:text-blue-400"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Read more `);
          } else {
            return [
              createTextVNode(" Read more ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></article>`);
    };
  }
});

const _sfc_main$3 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  _push(`<article${ssrRenderAttrs(mergeProps({ class: "bg-white dark:bg-gray-900 container mx-auto my-5 p-5 lg:-mx-6 flex justify-center" }, _attrs))}><iframe src="https://player.fireside.fm/v2/XHXVzqW5+q779jnKM?theme=dark" width="740" height="200" frameborder="0" scrolling="no"></iframe></article>`);
}
const _sfc_setup$1 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/FeaturedPodcast.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender]]);

const _sfc_main$2 = /* @__PURE__ */ defineComponent({
  __name: "Card",
  __ssrInlineRender: true,
  props: {
    item: {},
    section: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _component_NuxtImg = _sfc_main$6;
      const _component_Date = _sfc_main$8;
      const _component_TagsList = _sfc_main$7;
      _push(`<article${ssrRenderAttrs(mergeProps({ class: "container bg-white shadow-2xl rounded-2xl p-5 grid grid-cols-3 gap-6 auto-cols-[minmax(0,_2fr)]" }, _attrs))}><div class="h-full w-full object-cover">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.url || _ctx.item.path,
        target: _ctx.item.url ? "_blank" : "_self"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_NuxtImg, {
              provider: _ctx.item.provider || "cloudinary",
              src: _ctx.item.image,
              alt: _ctx.item.title,
              width: "272",
              height: "272",
              fit: "thumb",
              format: "webp",
              loading: "lazy",
              class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_NuxtImg, {
                provider: _ctx.item.provider || "cloudinary",
                src: _ctx.item.image,
                alt: _ctx.item.title,
                width: "272",
                height: "272",
                fit: "thumb",
                format: "webp",
                loading: "lazy",
                class: "scale-90 transition-all duration-400 hover:scale-100 rounded"
              }, null, 8, ["provider", "src", "alt"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div><div class="col-span-2">`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: _ctx.item.url || _ctx.item.path,
        target: _ctx.item.url ? "_blank" : "_self"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<h3 class="title-font text-lg font-medium text-gray-600 mb-2 leading-tight"${_scopeId}>${ssrInterpolate(_ctx.item.title)}</h3>`);
            _push2(ssrRenderComponent(_component_Date, {
              date: _ctx.item.date
            }, null, _parent2, _scopeId));
          } else {
            return [
              createVNode("h3", { class: "title-font text-lg font-medium text-gray-600 mb-2 leading-tight" }, toDisplayString(_ctx.item.title), 1),
              createVNode(_component_Date, {
                date: _ctx.item.date
              }, null, 8, ["date"])
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_TagsList, {
        tags: _ctx.item.tags,
        section: _ctx.section
      }, null, _parent));
      _push(`</div></article>`);
    };
  }
});

const _sfc_main$1 = /* @__PURE__ */ defineComponent({
  __name: "CardList",
  __ssrInlineRender: true,
  props: {
    list: {},
    section: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Card = _sfc_main$2;
      _push(`<ul${ssrRenderAttrs(mergeProps({ class: "mt-12 grid gap-6 mx-auto md:grid-cols-2 lg:grid-cols-3 md:max-w-none" }, _attrs))}><!--[-->`);
      ssrRenderList(_ctx.list, (item) => {
        _push(`<li class="flex flex-col">`);
        _push(ssrRenderComponent(_component_Card, {
          item,
          section: _ctx.section
        }, null, _parent));
        _push(`</li>`);
      });
      _push(`<!--]--></ul>`);
    };
  }
});

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: articles } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "articles-home",
      () => queryCollection("blog").order("date", "DESC").skip(1).limit(6).all()
    )), __temp = await __temp, __restore(), __temp);
    const { data: featuredPost } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "featured-article",
      () => queryCollection("blog").order("date", "DESC").limit(1).first()
    )), __temp = await __temp, __restore(), __temp);
    const { data: videos } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "videos-home",
      () => queryCollection("videos").order("date", "DESC").limit(4).all()
    )), __temp = await __temp, __restore(), __temp);
    const { data: podcasts } = ([__temp, __restore] = withAsyncContext(() => useAsyncData(
      "podcasts-home",
      () => queryCollection("podcasts").order("date", "DESC").limit(3).all()
    )), __temp = await __temp, __restore(), __temp);
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtImg = _sfc_main$6;
      const _component_AppSubtitle = __nuxt_component_1;
      const _component_FeaturedSection = _sfc_main$4;
      const _component_FeaturedPodcast = __nuxt_component_3;
      const _component_NuxtLink = __nuxt_component_0;
      const _component_CardList = _sfc_main$1;
      const _component_VideoList = _sfc_main$9;
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-046551b3><div class="hero_texts text-center px-4 sm:px-6" data-v-046551b3><div class="hero_image flex justify-center" data-v-046551b3>`);
      _push(ssrRenderComponent(_component_NuxtImg, {
        provider: "cloudinary",
        class: "rounded-full mb-4 mt-8 profile-pic border-white border",
        src: "c_fill,ar_1:1,g_auto,r_max,q_auto,fl_lossy,f_auto/v1589119213/debbie.codes/debbie-thumb_clt00n",
        alt: "Debbie O'Brien",
        quality: "80",
        format: "webp"
      }, null, _parent));
      _push(`</div><h1 class="name dark:text-white uppercase mb-4 text-2xl sm:text-3xl" data-v-046551b3> Debbie <span class="text-primary" data-v-046551b3>O&#39;Brien</span></h1><div class="dark:text-white subtitle font-medium mb-12 sm:mb-16 lg:mb-20 text-base sm:text-lg" data-v-046551b3><p class="mb-4" data-v-046551b3> Principal Technical Program Manager at Microsoft </p><p data-v-046551b3><a href="https://developers.google.com/community/experts/directory/profile/profile-debbie-o-brien" target="_blank" rel="nofollow noopener noreferrer" data-v-046551b3> Google GDE </a> | <a href="https://mvp.microsoft.com/en-us" target="_blank" rel="nofollow noopener noreferrer" data-v-046551b3> Former Microsoft MVP </a> | <a href="https://stars.github.com/alumni/" target="_blank" rel="nofollow noopener noreferrer" data-v-046551b3> GitHub Star Alumni </a></p><p class="mt-4" data-v-046551b3><a href="https://nuxtjs.org/teams/" target="_blank" rel="nofollow noopener noreferrer" data-v-046551b3> Nuxt Ambassador </a></p></div></div><div class="px-4 sm:px-6" data-v-046551b3>`);
      _push(ssrRenderComponent(_component_AppSubtitle, { id: "featured-posts" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Featured Post`);
          } else {
            return [
              createTextVNode("Featured Post")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(featuredPost) !== null) {
        _push(ssrRenderComponent(_component_FeaturedSection, {
          "aria-labelledby": "featured-posts",
          item: unref(featuredPost),
          section: "blog"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(ssrRenderComponent(_component_AppSubtitle, { id: "featured-posts" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`Featured Podcast`);
          } else {
            return [
              createTextVNode("Featured Podcast")
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(featuredPost) !== null) {
        _push(ssrRenderComponent(_component_FeaturedPodcast, { "aria-labelledby": "featured-podcast" }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<section aria-labelledby="recent-posts" class="mt-12 sm:mt-16" data-v-046551b3>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/blog" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppSubtitle, { id: "recent-posts" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Recent Blog Posts `);
                } else {
                  return [
                    createTextVNode(" Recent Blog Posts ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppSubtitle, { id: "recent-posts" }, {
                default: withCtx(() => [
                  createTextVNode(" Recent Blog Posts ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(articles) !== null) {
        _push(ssrRenderComponent(_component_CardList, {
          list: unref(articles),
          section: "blog"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section aria-labelledby="recent-videos" class="mt-12 sm:mt-16" data-v-046551b3>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/videos" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppSubtitle, { id: "recent-videos" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Recent Videos `);
                } else {
                  return [
                    createTextVNode(" Recent Videos ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppSubtitle, { id: "recent-videos" }, {
                default: withCtx(() => [
                  createTextVNode(" Recent Videos ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(videos) !== null) {
        _push(ssrRenderComponent(_component_VideoList, { list: unref(videos) }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section><section aria-labelledby="recent-podcasts" class="mt-12 sm:mt-16" data-v-046551b3>`);
      _push(ssrRenderComponent(_component_NuxtLink, { to: "/podcasts" }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(ssrRenderComponent(_component_AppSubtitle, { id: "recent-podcasts" }, {
              default: withCtx((_2, _push3, _parent3, _scopeId2) => {
                if (_push3) {
                  _push3(` Recent Podcasts `);
                } else {
                  return [
                    createTextVNode(" Recent Podcasts ")
                  ];
                }
              }),
              _: 1
            }, _parent2, _scopeId));
          } else {
            return [
              createVNode(_component_AppSubtitle, { id: "recent-podcasts" }, {
                default: withCtx(() => [
                  createTextVNode(" Recent Podcasts ")
                ]),
                _: 1
              })
            ];
          }
        }),
        _: 1
      }, _parent));
      if (unref(podcasts) !== null) {
        _push(ssrRenderComponent(_component_CardList, {
          list: unref(podcasts),
          section: "podcasts"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-046551b3"]]);

export { index as default };
//# sourceMappingURL=index.vue.mjs.map
