<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryCollection('about').first())

const title = ref('About Debbie and her experience as a developer')
const description = ref(
  'Google Developer Expert, Microsoft Most Valueable Professional, GitHub Star, Cloudinary MDE, Nuxt Ambassador, Auth0 Ambassador',
)

const stats = ref([
  { value: 15, label: 'Years Experience', suffix: '+' },
  { value: 100, label: 'Conference Talks', suffix: '+' },
  { value: 6, label: 'Continents Visited', suffix: '' },
  { value: 4, label: 'Black Belt Degree', suffix: 'th' },
])

const highlights = ref([
  {
    icon: '💼',
    title: 'Principal TPM',
    description: 'Microsoft',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: '🎯',
    title: 'Google Developer Expert',
    description: 'Web Technologies',
    gradient: 'from-red-500 to-orange-500',
  },
  {
    icon: '🚀',
    title: 'Nuxt Ambassador',
    description: 'Framework Advocate',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: '🥋',
    title: 'Taekwondo Master',
    description: '4th Degree Black Belt',
    gradient: 'from-purple-500 to-pink-500',
  },
])

const awards = ref([
  {
    name: 'GitHub Star Alumni',
    url: 'https://stars.github.com/alumni/',
    about:
      'GitHub Stars are experts and technical leaders who passionately share their knowledge, online and in-person, with communities in which they live and work. At the time of publishing this there were only 36 stars worldwide.',
  },
  {
    name: 'Google Developer Expert',
    url: 'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien',
    about:
      'The Google Developers Experts program is a global network of highly experienced technology experts, influencers and thought leaders who actively support developers, companies and tech communities by speaking at events, publishing content. Nearly 700 Experts represent 18+ Google technologies around the world!',
  },
  {
    name: 'Former Microsoft Most Valuable Professional',
    url: 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien',
    about:
      'The Microsoft Most Valuable Professional (MVP) award is given by Microsoft to technology experts who passionately share their knowledge with the community. They are awarded to people who actively share their technical expertise with the different technology communities related directly, or indirectly to Microsoft.',
  },
  {
    name: 'Media Developer Expert',
    url: 'https://cloudinary.com/mde',
    about:
      'Energizing a diverse community of developers to share insight, expertise, and best practices of using media technology in web and mobile apps.',
  },
  {
    name: 'Auth0 Ambassador',
    url: 'https://auth0.com/ambassador-program/',
    about:
      'Part of a global team of ambassadors empowering communities and help make the Internet a safer place by attending and hosting meetups, conferences, and other events that focus on authentication, security, and identity topics.',
  },
  {
    name: 'Microsoft Certified',
    url: 'https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377',
    about:
      'Passing Exam 480: Programming in HTML5 with JavaScript and CSS3 validates a candidate\'s ability to access and secure data as well as implement document structures, objects, and program flow.',
  },
  {
    name: 'Bachelor\'s Level Diploma',
    url: 'https://openclassrooms.com/en/paths/315-front-end-developer',
    about:
      'A 12 month program complete with one to one mentoring where you complete projects based on scenarios from the professional world, look for solutions, create your deliverables and present them convincingly in front of your mentor! ',
  },
  {
    name: 'Full Stack JavaScript Tech Degree',
    url: 'https://teamtreehouse.com/techdegree',
    about:
      'Techdegree is a bootcamp-tier program that guides you through a full curriculum of Treehouse courses. In addition, it includes a portfolio of curated projects, workshops, quizzes, and access to the exclusive Treehouse Slack community.',
  },
])

// Animation states
const heroVisible = ref(false)
const statsVisible = ref(false)
const highlightsVisible = ref(false)
const awardsVisible = ref(false)

onMounted(() => {
  // Trigger hero animation immediately
  setTimeout(() => {
    heroVisible.value = true
  }, 100)

  // Setup intersection observers for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  }

  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        statsVisible.value = true
      }
    })
  }, observerOptions)

  const highlightsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        highlightsVisible.value = true
      }
    })
  }, observerOptions)

  const awardsObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        awardsVisible.value = true
      }
    })
  }, observerOptions)

  const statsEl = document.querySelector('#stats-section')
  const highlightsEl = document.querySelector('#highlights-section')
  const awardsEl = document.querySelector('#awards-section')

  if (statsEl) statsObserver.observe(statsEl)
  if (highlightsEl) highlightsObserver.observe(highlightsEl)
  if (awardsEl) awardsObserver.observe(awardsEl)
})

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
  <main class="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
    <!-- Animated Background -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-blue-950 dark:to-purple-950" />
      <div class="absolute top-0 right-0 w-96 h-96 bg-purple-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob" />
      <div class="absolute top-0 left-0 w-96 h-96 bg-blue-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div class="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-300 dark:bg-pink-600 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
    </div>

    <!-- Hero Section -->
    <section class="relative min-h-[80vh] flex items-center justify-center px-4 sm:px-6 py-20">
      <div class="container mx-auto max-w-7xl">
        <div class="grid lg:grid-cols-2 gap-12 items-center">
          <!-- Left Column: Text Content -->
          <div :class="['space-y-8', heroVisible ? 'animate-slide-in-left' : 'opacity-0']">
            <div class="space-y-4">
              <div class="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary/10 to-blue-600/10 dark:from-primary/20 dark:to-blue-600/20 rounded-full border border-primary/20 animate-pulse-slow">
                <div class="w-2 h-2 bg-primary rounded-full animate-ping" />
                <span class="text-sm font-medium text-primary">Available for speaking & consulting</span>
              </div>

              <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                <span class="block text-gray-900 dark:text-white">Hi, I'm</span>
                <span class="block bg-gradient-to-r from-primary via-purple-600 to-blue-600 bg-clip-text text-transparent animate-gradient">
                  Debbie O'Brien
                </span>
              </h1>

              <div class="flex flex-wrap gap-2">
                <span class="px-3 py-1 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">
                  Developer
                </span>
                <span class="px-3 py-1 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">
                  Speaker
                </span>
                <span class="px-3 py-1 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">
                  Teacher
                </span>
                <span class="px-3 py-1 text-xs font-semibold bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-full">
                  Athlete
                </span>
              </div>
            </div>

            <p class="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
              Principal Technical Program Manager at Microsoft, Google Developer Expert, and international speaker passionate about web technologies, testing, and community building.
            </p>

            <div class="flex flex-wrap gap-4">
              <a
                href="#awards-section"
                class="group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
              >
                View Achievements
                <svg class="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
            </div>
          </div>

          <!-- Right Column: Decorative Element -->
          <div :class="['relative', heroVisible ? 'animate-slide-in-right' : 'opacity-0']">
            <div class="relative aspect-square max-w-md mx-auto">
              <!-- Floating orbs -->
              <div class="absolute inset-0">
                <div class="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary to-blue-600 rounded-full filter blur-2xl opacity-60 animate-float" />
                <div class="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full filter blur-2xl opacity-60 animate-float animation-delay-2000" />
                <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full filter blur-3xl opacity-40 animate-float animation-delay-4000" />
              </div>

              <!-- Central decorative element -->
              <div class="relative w-full h-full flex items-center justify-center">
                <div class="w-64 h-64 bg-gradient-to-br from-primary/20 to-blue-600/20 dark:from-primary/30 dark:to-blue-600/30 rounded-3xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 rotate-6 animate-rotate-slow" />
                <div class="absolute w-64 h-64 bg-gradient-to-br from-purple-600/20 to-pink-600/20 dark:from-purple-600/30 dark:to-pink-600/30 rounded-3xl backdrop-blur-sm border border-white/20 dark:border-gray-700/20 -rotate-6 animate-rotate-slow-reverse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Stats Section -->
    <section id="stats-section" class="py-16 px-4 sm:px-6">
      <div class="container mx-auto max-w-7xl">
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(stat, index) in stats"
            :key="stat.label"
            :class="[
              'group relative bg-white dark:bg-gray-800 rounded-2xl p-6 text-center border border-gray-200 dark:border-gray-700 hover:border-primary dark:hover:border-primary transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-2',
              statsVisible ? 'animate-scale-in' : 'opacity-0'
            ]"
            :style="`animation-delay: ${index * 100}ms`"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-primary/5 to-blue-600/5 dark:from-primary/10 dark:to-blue-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div class="relative z-10">
              <div class="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent mb-2">
                {{ stat.value }}{{ stat.suffix }}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400 font-medium">
                {{ stat.label }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- About Content -->
    <section class="py-16 px-4 sm:px-6">
      <div class="container mx-auto max-w-7xl">
        <div class="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 lg:p-12 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl">
          <div class="prose prose-lg dark:prose-invert max-w-none">
            <ContentRenderer v-if="about" :value="about" class="text-gray-700 dark:text-gray-200 leading-relaxed" />
          </div>
        </div>
      </div>
    </section>

    <!-- Highlights Grid (Bento Box Style) -->
    <section id="highlights-section" class="py-16 px-4 sm:px-6">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-12">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Key
            <span class="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Highlights
            </span>
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full" />
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(highlight, index) in highlights"
            :key="highlight.title"
            :class="[
              'group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 hover:border-transparent transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 overflow-hidden',
              highlightsVisible ? 'animate-fade-in-up' : 'opacity-0'
            ]"
            :style="`animation-delay: ${index * 100}ms`"
          >
            <!-- Gradient overlay on hover -->
            <div :class="[
              'absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-10 dark:group-hover:opacity-20 transition-opacity duration-300',
              highlight.gradient
            ]" />

            <div class="relative z-10">
              <div class="text-5xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                {{ highlight.icon }}
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {{ highlight.title }}
              </h3>
              <p class="text-gray-600 dark:text-gray-400">
                {{ highlight.description }}
              </p>
            </div>

            <!-- Decorative corner accent -->
            <div :class="[
              'absolute top-0 right-0 w-20 h-20 bg-gradient-to-br opacity-10 rounded-bl-3xl transition-all duration-300 group-hover:w-32 group-hover:h-32',
              highlight.gradient
            ]" />
          </div>
        </div>
      </div>
    </section>

    <!-- Awards Section -->
    <section id="awards-section" class="py-16 sm:py-24 px-4 sm:px-6">
      <div class="container mx-auto max-w-7xl">
        <div class="text-center mb-16">
          <h2 class="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Awards &
            <span class="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
              Achievements
            </span>
          </h2>
          <div class="w-20 h-1 bg-gradient-to-r from-primary to-blue-600 mx-auto rounded-full mb-4" />
          <p class="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Recognition and certifications that reflect my journey in technology and community contribution.
          </p>
        </div>

        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="(award, index) in awards"
            :key="award.name"
            :class="[
              'group relative bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-2 hover:border-primary dark:hover:border-primary overflow-hidden',
              awardsVisible ? 'animate-fade-in-up' : 'opacity-0'
            ]"
            :style="`animation-delay: ${index * 80}ms`"
          >
            <!-- Animated gradient background -->
            <div class="absolute inset-0 bg-gradient-to-br from-primary/0 via-blue-600/0 to-purple-600/0 group-hover:from-primary/5 group-hover:via-blue-600/5 group-hover:to-purple-600/5 dark:group-hover:from-primary/10 dark:group-hover:via-blue-600/10 dark:group-hover:to-purple-600/10 transition-all duration-500" />

            <!-- Decorative corner -->
            <div class="absolute -top-10 -right-10 w-24 h-24 bg-gradient-to-br from-primary to-blue-600 rounded-full opacity-0 group-hover:opacity-10 blur-2xl transition-opacity duration-500" />

            <div class="relative z-10">
              <!-- Icon -->
              <div class="mb-6 relative">
                <div class="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg shadow-primary/20">
                  <svg class="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
                  </svg>
                </div>
              </div>

              <!-- Title -->
              <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-primary dark:group-hover:text-primary transition-colors duration-300">
                {{ award.name }}
              </h3>

              <!-- Description -->
              <p class="text-gray-600 dark:text-gray-300 leading-relaxed text-sm mb-6">
                {{ award.about }}
              </p>

              <!-- CTA -->
              <a
                :href="award.url"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 text-primary hover:text-blue-600 dark:hover:text-blue-400 font-semibold text-sm transition-all duration-300 group-hover:gap-3"
                :aria-label="`Learn more about ${award.name} (opens in new tab)`"
              >
                Learn More
                <svg class="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </a>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Bottom CTA -->
    <section class="py-20 px-4 sm:px-6">
      <div class="container mx-auto max-w-4xl">
        <div class="relative bg-gradient-to-r from-primary to-blue-600 rounded-3xl p-12 text-center overflow-hidden">
          <!-- Decorative elements -->
          <div class="absolute top-0 left-0 w-40 h-40 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
          <div class="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-1/2 translate-y-1/2" />

          <div class="relative z-10">
            <h2 class="text-3xl sm:text-4xl font-bold text-white mb-4">
              Let's Connect!
            </h2>
            <p class="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
              Interested in collaborating, speaking opportunities, or just want to chat about web technologies?
            </p>
            <a
              href="https://www.youtube.com/c/DebbieOBrien"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-xl hover:bg-gray-100 transition-all duration-300 hover:scale-105 shadow-xl"
            >
              Check out my YouTube Channel
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  </main>
</template>

<style scoped>
/* Blob animation for background */
@keyframes blob {
  0%, 100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(30px, -50px) scale(1.1);
  }
  66% {
    transform: translate(-20px, 20px) scale(0.9);
  }
}

.animate-blob {
  animation: blob 7s infinite;
}

.animation-delay-2000 {
  animation-delay: 2s;
}

.animation-delay-4000 {
  animation-delay: 4s;
}

/* Floating animation */
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Gradient animation */
@keyframes gradient {
  0%, 100% {
    background-size: 200% 200%;
    background-position: left center;
  }
  50% {
    background-size: 200% 200%;
    background-position: right center;
  }
}

.animate-gradient {
  animation: gradient 8s ease infinite;
}

/* Pulse slow */
@keyframes pulse-slow {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}

.animate-pulse-slow {
  animation: pulse-slow 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

/* Rotate animations */
@keyframes rotate-slow {
  0% {
    transform: rotate(6deg);
  }
  50% {
    transform: rotate(12deg);
  }
  100% {
    transform: rotate(6deg);
  }
}

@keyframes rotate-slow-reverse {
  0% {
    transform: rotate(-6deg);
  }
  50% {
    transform: rotate(-12deg);
  }
  100% {
    transform: rotate(-6deg);
  }
}

.animate-rotate-slow {
  animation: rotate-slow 8s ease-in-out infinite;
}

.animate-rotate-slow-reverse {
  animation: rotate-slow-reverse 8s ease-in-out infinite;
}

/* Slide in animations */
@keyframes slide-in-left {
  from {
    opacity: 0;
    transform: translateX(-50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slide-in-right {
  from {
    opacity: 0;
    transform: translateX(50px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.animate-slide-in-left {
  animation: slide-in-left 0.8s ease-out;
}

.animate-slide-in-right {
  animation: slide-in-right 0.8s ease-out;
}

/* Scale in animation */
@keyframes scale-in {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.animate-scale-in {
  animation: scale-in 0.6s ease-out both;
}

/* Fade in up animation */
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out both;
}

/* Stagger delays for cards */
.grid > div:nth-child(1),
.grid > article:nth-child(1) { animation-delay: 0ms; }
.grid > div:nth-child(2),
.grid > article:nth-child(2) { animation-delay: 80ms; }
.grid > div:nth-child(3),
.grid > article:nth-child(3) { animation-delay: 160ms; }
.grid > div:nth-child(4),
.grid > article:nth-child(4) { animation-delay: 240ms; }
.grid > div:nth-child(5),
.grid > article:nth-child(5) { animation-delay: 320ms; }
.grid > div:nth-child(6),
.grid > article:nth-child(6) { animation-delay: 400ms; }
.grid > div:nth-child(7),
.grid > article:nth-child(7) { animation-delay: 480ms; }
.grid > div:nth-child(8),
.grid > article:nth-child(8) { animation-delay: 560ms; }
</style>
