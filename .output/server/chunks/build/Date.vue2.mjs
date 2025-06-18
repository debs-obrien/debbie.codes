import { defineComponent, mergeProps, unref } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';

function formatDate(dateString, options = {}) {
  const {
    year = "numeric",
    month = "long",
    day = "numeric",
    locale = "en-US"
  } = options;
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "";
    }
    return date.toLocaleDateString(locale, { year, month, day });
  } catch {
    return "";
  }
}

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "Date",
  __ssrInlineRender: true,
  props: {
    date: {}
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<time${ssrRenderAttrs(mergeProps({
        datetime: _ctx.date,
        class: "tracking-widest text-xs title-font font-medium text-gray-400 mb-1 block"
      }, _attrs))}>${ssrInterpolate(("formatDate" in _ctx ? _ctx.formatDate : unref(formatDate))(_ctx.date))}</time>`);
    };
  }
});

export { _sfc_main as _, formatDate as f };
//# sourceMappingURL=Date.vue2.mjs.map
