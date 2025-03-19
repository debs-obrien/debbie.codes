<script setup lang="ts">
const { data: about } = await useAsyncData('about', () => queryCollection('about').first())

const type = ref('')
const title = ref('About Debbie and her experience as a developer')
const description = ref(
  'Google Developer Expert, Microsoft Most Valueable Professional, GitHub Star, Cloudinary MDE, Nuxt Ambassador, Auth0 Ambassador'
)
const awards = ref([
  {
    name: 'GitHub Star Alumni',
    url: 'https://stars.github.com/alumni/',
    image:
      'c_scale,h_130,fl_lossy,f_auto/v1612373645/debbie.codes/github-stars-logo_color_eochea.png',
    about:
      'GitHub Stars are experts and technical leaders who passionately share their knowledge, online and in-person, with communities in which they live and work. At the time of publishing this there were only 36 stars worldwide.',
  },
  {
    name: 'Google Developer Expert',
    url: 'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien',
    image:
      'c_scale,w_300/v1587830943/debbie.codes/gd_experts_lockup_horizontal_color_vqw2sw.jpg',
    about:
      'The Google Developers Experts program is a global network of highly experienced technology experts, influencers and thought leaders who actively support developers, companies and tech communities by speaking at events, publishing content. Nearly 700 Experts represent 18+ Google technologies around the world!',
  },
  {
    name: 'Former Microsoft Most Valuable Professional',
    url: 'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien',
    image: 'fl_lossy,f_auto,c_fit,w_300/v1579977213/ME/mvp_o5w23e.png',
    about:
      'The Microsoft Most Valuable Professional (MVP) award is given by Microsoft to technology experts who passionately share their knowledge with the community. They are awarded to people who actively share their technical expertise with the different technology communities related directly, or indirectly to Microsoft.',
  },
  {
    name: 'Media Developer Expert',
    url: 'https://cloudinary.com/mde',
    image:
      'fl_lossy,f_auto,c_scale,w_300/v1587830477/debbie.codes/MDE_Logo_Dark-01_bhzwqg.png',
    about:
      'Energizing a diverse community of developers to share insight, expertise, and best practices of using media technology in web and mobile apps.',
  },
  {
    name: 'Auth0 Ambassador',
    url: 'https://auth0.com/ambassador-program/',
    image: {
      dark: 'fl_lossy,f_auto,c_scale,w_300/v1612373628/debbie.codes/ambassador-program-logo-white_twmp4l.png',
      light:
        'fl_lossy,f_auto,c_scale,w_300/v1612373628/debbie.codes/ambassador-program-logo-black_u3d5z0.png',
    },
    about:
      'Part of a global team of ambassadors empowering communities and help make the Internet a safer place by attending and hosting meetups, conferences, and other events that focus on authentication, security, and identity topics.',
  },
  {
    name: 'Microsoft Certified',
    url: 'https://www.youracclaim.com/badges/2bb11106-cef6-4a1c-9618-1ba63b413377',
    image:
      'fl_lossy,f_auto,c_scale,w_150/v1612427038/debbie.codes/Programming_in_HTML5_with_JavaScript_and_Css3-01_p5l1ro.png',
    about:
      "Passing Exam 480: Programming in HTML5 with JavaScript and CSS3 validates a candidate's ability to access and secure data as well as implement document structures, objects, and program flow.",
  },
  {
    name: "Bachelor's Level Diploma",
    url: 'https://openclassrooms.com/en/paths/315-front-end-developer',
    image:
      'fl_lossy,f_auto,c_scale,w_250/v1612427336/debbie.codes/open-classrooms-degree_ddgwhd.jpg',
    about:
      'A 12 month program complete with one to one mentoring where you complete projects based on scenarios from the professional world, look for solutions, create your deliverables and present them convincingly in front of your mentor! ',
  },
  {
    name: 'Full Stack JavaScript Tech Degree',
    url: 'https://teamtreehouse.com/techdegree',
    image:
      'fl_lossy,f_auto,c_scale,w_250/v1612427276/debbie.codes/treehouse-tech-degree_uconns.jpg',
    about:
      'Techdegree is a bootcamp-tier program that guides you through a full curriculum of Treehouse courses. In addition, it includes a portfolio of curated projects, workshops, quizzes, and access to the exclusive Treehouse Slack community.',
  },
])

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
  <div class="container mx-auto">
    <div class="mx-auto">
      <div class="max-w-6xl mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- <div class="hidden lg:block">
            <img
              src="https://res.cloudinary.com/debsobrien/image/upload/c_scale,w_300/v1579977198/ME/debbie-mvp_gcgsof.png"
              alt="Debbie O'Brien - Microsoft Most Valuable Professional"
            >
          </div> -->
          <div class="col-span-2">
            <span class="font-Saira mb-4 text-primary">Hello There!</span>

            <h3 class="uppercase font-semibold mb-4">
              I'm Debbie O'Brien
            </h3>
            <div class="mb-4">
              <p class="mb-2">
                <ContentRenderer v-if="about" :value="about" />
              </p>
            </div>
          </div>
        </div>
        <h2 class="font-bold text-primary text-3xl my-8">
          Awards and Achievements
        </h2>

        <div class="">
          <div
            v-for="company in awards"
            :key="company.name"
            class="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16"
          >
            <!-- <div class="mt-2">
              <img
                v-if="company.image.dark && $colorMode.preference === 'dark'"
                :src="`https://res.cloudinary.com/debsobrien/image/upload/${company.image.dark}`"
                alt=""
              >
              <img
                v-else-if="
                  company.image.light && $colorMode.preference !== 'dark'
                "
                :src="`https://res.cloudinary.com/debsobrien/image/upload/${company.image.light}`"
                alt=""
              >
              <img
                v-else
                :src="`https://res.cloudinary.com/debsobrien/image/upload/${company.image}`"
                alt=""
              >
            </div> -->

            <div class="col-span-2">
              <h3 class="font-bold text-primary text-2xl pb-4">
                <a
                  :href="company.url"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {{ company.name }}
                </a>
              </h3>
              <p>
                {{ company.about }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
