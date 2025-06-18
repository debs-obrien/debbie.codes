import { defineComponent, withAsyncContext, ref, mergeProps, unref, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderList, ssrRenderAttr, ssrInterpolate } from 'vue/server-renderer';
import { u as useAsyncData, q as queryCollection } from './app.mjs';
import { u as useHead } from './server.mjs';
import { _ as _sfc_main$1 } from './ContentRenderer.vue2.mjs';
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

const _sfc_main = /* @__PURE__ */ defineComponent({
  __name: "about",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const { data: about } = ([__temp, __restore] = withAsyncContext(() => useAsyncData("about", () => queryCollection("about").first())), __temp = await __temp, __restore(), __temp);
    ref("");
    const title = ref("About Debbie and her experience as a developer");
    const description = ref(
      "Google Developer Expert, Microsoft Most Valueable Professional, GitHub Star, Cloudinary MDE, Nuxt Ambassador, Auth0 Ambassador"
    );
    const awards = ref([
      {
        name: "GitHub Star Alumni",
        url: "https://stars.github.com/alumni/",
        image: "c_scale,h_130,fl_lossy,f_auto/v1612373645/debbie.codes/github-stars-logo_color_eochea.png",
        about: "GitHub Stars are experts and technical leaders who passionately share their knowledge, online and in-person, with communities in which they live and work. At the time of publishing this there were only 36 stars worldwide."
      },
      {
        name: "Google Developer Expert",
        url: "https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien",
        image: "c_scale,w_300/v1587830943/debbie.codes/gd_experts_lockup_horizontal_color_vqw2sw.jpg",
        about: "The Google Developers Experts program is a global network of highly experienced technology experts, influencers and thought leaders who actively support developers, companies and tech communities by speaking at events, publishing content. Nearly 700 Experts represent 18+ Google technologies around the world!"
      },
      {
        name: "Former Microsoft Most Valuable Professional",
        url: "https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien",
        image: "fl_lossy,f_auto,c_fit,w_300/v1579977213/ME/mvp_o5w23e.png",
        about: "The Microsoft Most Valuable Professional (MVP) award is given by Microsoft to technology experts who passionately share their knowledge with the community. They are awarded to people who actively share their technical expertise with the different technology communities related directly, or indirectly to Microsoft."
      },
      {
        name: "Media Developer Expert",
        url: "https://cloudinary.com/mde",
        image: "fl_lossy,f_auto,c_scale,w_300/v1587830477/debbie.codes/MDE_Logo_Dark-01_bhzwqg.png",
        about: "Energizing a diverse community of developers to share insight, expertise, and best practices of using media technology in web and mobile apps."
      },
      {
        name: "Auth0 Ambassador",
        url: "https://auth0.com/ambassador-program/",
        image: {
          dark: "fl_lossy,f_auto,c_scale,w_300/v1612373628/debbie.codes/ambassador-program-logo-white_twmp4l.png",
          light: "fl_lossy,f_auto,c_scale,w_300/v1612373628/debbie.codes/ambassador-program-logo-black_u3d5z0.png"
        },
        about: "Part of a global team of ambassadors empowering communities and help make the Internet a safer place by attending and hosting meetups, conferences, and other events that focus on authentication, security, and identity topics."
      },
      {
        name: "Microsoft Certified",
        url: "https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377",
        image: "fl_lossy,f_auto,c_scale,w_150/v1612427038/debbie.codes/Programming_in_HTML5_with_JavaScript_and_Css3-01_p5l1ro.png",
        about: "Passing Exam 480: Programming in HTML5 with JavaScript and CSS3 validates a candidate's ability to access and secure data as well as implement document structures, objects, and program flow."
      },
      {
        name: "Bachelor's Level Diploma",
        url: "https://openclassrooms.com/en/paths/315-front-end-developer",
        image: "fl_lossy,f_auto,c_scale,w_250/v1612427336/debbie.codes/open-classrooms-degree_ddgwhd.jpg",
        about: "A 12 month program complete with one to one mentoring where you complete projects based on scenarios from the professional world, look for solutions, create your deliverables and present them convincingly in front of your mentor! "
      },
      {
        name: "Full Stack JavaScript Tech Degree",
        url: "https://teamtreehouse.com/techdegree",
        image: "fl_lossy,f_auto,c_scale,w_250/v1612427276/debbie.codes/treehouse-tech-degree_uconns.jpg",
        about: "Techdegree is a bootcamp-tier program that guides you through a full curriculum of Treehouse courses. In addition, it includes a portfolio of curated projects, workshops, quizzes, and access to the exclusive Treehouse Slack community."
      }
    ]);
    useHead({
      title: title.value,
      meta: [
        {
          name: "description",
          content: description.value
        }
      ],
      link: [
        {
          rel: "canonical",
          href: "https://debbie.codes/about"
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ContentRenderer = _sfc_main$1;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "container mx-auto px-4 sm:px-6" }, _attrs))}><div class="mx-auto"><div class="max-w-6xl mx-auto"><div class="grid grid-cols-1 lg:grid-cols-2 gap-8"><div class="col-span-2"><span class="font-Saira mb-4 text-primary text-lg">Hello There!</span><h3 class="uppercase font-semibold mb-6 text-2xl"> I&#39;m Debbie O&#39;Brien </h3><div class="prose prose-lg dark:prose-invert max-w-none">`);
      if (unref(about)) {
        _push(ssrRenderComponent(_component_ContentRenderer, {
          value: unref(about),
          class: "text-gray-600 dark:text-gray-300 leading-relaxed"
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div><h2 class="font-bold text-primary text-3xl my-8 sm:my-12"> Awards and Achievements </h2><div class="space-y-12 sm:space-y-16"><!--[-->`);
      ssrRenderList(unref(awards), (company) => {
        _push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8"><div class="col-span-2"><h3 class="font-bold text-primary text-xl sm:text-2xl pb-3 sm:pb-4 hover:text-primary/80 transition-colors"><a${ssrRenderAttr("href", company.url)} target="_blank" rel="noopener noreferrer">${ssrInterpolate(company.name)}</a></h3><p class="text-gray-600 dark:text-gray-300 leading-relaxed text-base sm:text-lg">${ssrInterpolate(company.about)}</p></div></div>`);
      });
      _push(`<!--]--></div></div></div></div>`);
    };
  }
});

const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/about.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=about.vue.mjs.map
