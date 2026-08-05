<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryCollection('about').first())

const title = ref('About Debbie and her experience as a developer')
const description = ref(
  'Google Developer Expert, former Microsoft MVP, GitHub Star Alumni, Cloudinary MDE, Nuxt Ambassador, Auth0 Ambassador',
)
const awards = ref([
  {
    name: 'GitHub Star Alumni',
    url: 'https://stars.github.com/alumni/',
    about:
      'Recognized as a GitHub Star for sharing knowledge with the community through talks, content, and open source. At the time, there were only 36 Stars worldwide.',
  },
  {
    name: 'Google Developer Expert',
    url: 'https://me.developers.google.com/u/115790798136433531532',
    about:
      'A Google Developer Expert in web technologies, supporting developers through speaking, teaching, and community work across the Google developer ecosystem.',
  },
  {
    name: 'Former Microsoft Most Valuable Professional',
    url: 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien',
    about:
      'Awarded as a Microsoft MVP for contributing technical expertise to developer communities connected with Microsoft technologies.',
  },
  {
    name: 'Nuxt Ambassador',
    url: 'https://nuxtjs.org/teams/',
    about:
      'Formerly Developer Relations at Nuxt, now a Nuxt Ambassador supporting the community through talks, content, and advocacy for Nuxt and the Vue ecosystem.',
  },
  {
    name: 'Media Developer Expert',
    url: 'https://cloudinary.com/mde',
    about:
      'A Cloudinary Media Developer Expert helping developers use media technology effectively in web and mobile apps.',
  },
  {
    name: 'Auth0 Ambassador',
    url: 'https://auth0.com/ambassador-program/',
    about:
      'An Auth0 Ambassador focused on authentication, security, and identity — through meetups, conferences, and community education.',
  },
  {
    name: 'Microsoft Certified',
    url: 'https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377',
    about:
      'Microsoft certified in Programming in HTML5 with JavaScript and CSS3, covering document structure, program flow, and working with data securely.',
  },
  {
    name: 'Bachelor\'s Level Diploma',
    url: 'https://openclassrooms.com/en/paths/315-front-end-developer',
    about:
      'Completed a 12-month front-end program with one-to-one mentoring, building real-world projects and presenting solutions end to end.',
  },
  {
    name: 'Full Stack JavaScript Tech Degree',
    url: 'https://teamtreehouse.com/techdegree',
    about:
      'Completed the Treehouse Full Stack JavaScript Techdegree, including a portfolio of projects, workshops, and guided curriculum.',
  },
])

const aboutRoot = ref<HTMLElement | null>(null)
useScrollReveal(aboutRoot)

useHead({
  title: title.value,
  meta: [
    {
      name: 'description',
      content: description.value,
    },
  ],
  link: [
    {
      rel: 'canonical',
      href: 'https://debbie.codes/about',
    },
  ],
})
</script>

<template>
  <main ref="aboutRoot" class="min-h-screen bg-white dark:bg-gray-900">
    <section class="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] -mt-top-bar w-screen bg-dark text-white overflow-hidden">
      <div class="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div class="about-glow" />
        <div class="about-grid" />
      </div>

      <div class="relative z-10 max-w-4xl mx-auto px-6 sm:px-10 pt-[7.5rem] pb-16 sm:pb-20 text-center">
        <p class="mb-4 text-primary text-sm font-semibold uppercase tracking-widest">
          About
        </p>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-bold uppercase tracking-wider leading-none mb-6">
          Hi, I'm <span class="text-primary">Debbie O'Brien</span>
        </h1>
        <div class="w-14 h-0.5 bg-primary mx-auto mb-10 rounded-full" aria-hidden="true" />

        <div class="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-8 sm:p-10 text-left">
          <div class="prose prose-invert max-w-none">
            <ContentRenderer v-if="about" :value="about" class="text-gray-200 leading-relaxed" />
          </div>
        </div>
      </div>
    </section>

    <section class="py-16 sm:py-20 px-4 sm:px-6">
      <div class="max-w-6xl mx-auto">
        <div class="animated-section text-center mb-12">
          <h2 id="awards-heading" class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Awards & Achievements
          </h2>
          <div class="w-14 h-0.5 bg-gray-300 dark:bg-gray-600 mx-auto rounded-full" aria-hidden="true" />
          <p class="mt-6 text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Recognition and certifications that reflect my journey in technology and community contribution.
          </p>
        </div>

        <section aria-labelledby="awards-heading">
          <div class="animated-section stagger-children grid gap-6 md:grid-cols-2 lg:grid-cols-3" role="list">
            <article
              v-for="award in awards"
              :key="award.name"
              class="group rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-6 transition-colors duration-200 hover:border-gray-400 dark:hover:border-gray-500"
            >
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary transition-colors">
                <a
                  :href="award.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-800 rounded-lg"
                  :aria-label="`Learn more about ${award.name} (opens in new tab)`"
                >
                  {{ award.name }}
                </a>
              </h3>

              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-5">
                {{ award.about }}
              </p>

              <a
                :href="award.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center text-gray-600 dark:text-gray-300 hover:text-primary font-medium text-sm transition-colors"
                :aria-label="`Learn more about ${award.name} (opens in new tab)`"
              >
                Learn More
                <svg class="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                  <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" />
                </svg>
              </a>
            </article>
          </div>
        </section>
      </div>
    </section>
  </main>
</template>

<style scoped>
.about-glow {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse 70% 55% at 50% 30%,
    rgba(216, 0, 45, 0.2),
    transparent 68%
  );
}

.about-grid {
  position: absolute;
  inset: 0;
  opacity: 0.06;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.55) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.55) 1px, transparent 1px);
  background-size: 48px 48px;
  mask-image: radial-gradient(ellipse 65% 55% at 50% 35%, black, transparent 75%);
}
</style>
