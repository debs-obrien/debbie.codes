<template>
  <div class="container mx-auto">
    <div class="mx-auto">
      <!-- <div class="hidden md:block md:w-2/5">
        <img
          src="https://res.cloudinary.com/debsobrien/image/upload/v1579977198/ME/debbie-mvp_gcgsof.png"
          alt="Debbie O'Brien - Microsoft Most Valuable Professional"
        />
      </div> -->
      <div class=" max-w-6xl mx-auto">
        <span class="font-Saira mb-4 text-primary">Hello There!</span>

        <h3 class="uppercase font-semibold mb-4">
          I'm Debbie O'Brien
        </h3>
        <div class="mb-4">
          <p class="mb-2">
            <nuxt-content :document="page" class="prose" />
          </p>

          <h2 class="font-bold text-primary text-3xl my-8">
            Awards and Achievements
          </h2>

          <div class="">
            <div
              v-for="company in awards"
              :key="company.name"
              class="grid parent mb-16"
            >
              <div class="mt-2">
                <img
                  v-if="company.image.dark && $colorMode.preference === 'dark'"
                  :src="
                    `https://res.cloudinary.com/debsobrien/image/upload/${company.image.dark}`
                  "
                  alt=""
                />
                <img
                  v-else-if="
                    company.image.light && $colorMode.preference !== 'dark'
                  "
                  :src="
                    `https://res.cloudinary.com/debsobrien/image/upload/${company.image.light}`
                  "
                  alt=""
                />
                <img
                  v-else
                  :src="
                    `https://res.cloudinary.com/debsobrien/image/upload/${company.image}`
                  "
                  alt=""
                />
              </div>

              <div class="">
                <h3 class="font-bold text-primary text-2xl">
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
  </div>
</template>
<script>
  export default {
    async asyncData({ $content }) {
      const page = await $content('about').fetch()

      return {
        page
      }
    },
    data() {
      return {
        type: '',
        title: 'About Debbie and her experience as a developer',
        description:
          'Head of Learning and Developer Advocate at NuxtJS, Google Developer Expert, Microsoft Most Valueable Professional, GitHub Star, Cloudinary MDE, Auth0 Ambassador',
        awards: [
          {
            name: 'Google Developer Expert',
            url:
              'https://developers.google.com/community/experts/directory/profile/profile-debbie_o_brien',
            image:
              'c_scale,w_330/v1587830943/debbie.codes/gd_experts_lockup_horizontal_color_vqw2sw.jpg',
            about:
              'The Google Developers Experts program is a global network of highly experienced technology experts, influencers and thought leaders who actively support developers, companies and tech communities by speaking at events, publishing content. Nearly 700 Experts represent 18+ Google technologies around the world!'
          },
          {
            name: 'Microsoft Most Valuable Professional',
            url:
              'https://mvp.microsoft.com/en-us/PublicProfile/5003613?fullName=Debbie%20O%27Brien',
            image: 'fl_lossy,f_auto,c_fit,h_160/v1579977213/ME/mvp_o5w23e.png',
            about:
              'The Microsoft Most Valuable Professional (MVP) award is given by Microsoft to technology experts who passionately share their knowledge with the community. They are awarded to people who actively share their technical expertise with the different technology communities related directly, or indirectly to Microsoft.'
          },
          {
            name: 'GitHub Star',
            url: 'https://stars.github.com/profiles/debs-obrien/',
            image:
              'c_scale,h_130,fl_lossy,f_auto/v1612373645/debbie.codes/github-stars-logo_color_eochea.png',
            about:
              'GitHub Stars are experts and technical leaders who passionately share their knowledge, online and in-person, with communities in which they live and work. At the time of publishing this, we are 34 stars worldwide.'
          },
          {
            name: 'Media Developer Expert',
            url: 'https://cloudinary.com/mde',
            image:
              'fl_lossy,f_auto,c_scale,w_230/v1587830477/debbie.codes/MDE_Logo_Dark-01_bhzwqg.png',
            about:
              'Energizing a diverse community of developers to share insight, expertise, and best practices of using media technology in web and mobile apps.'
          },
          {
            name: 'Auth0 Ambassador',
            url: 'https://auth0.com/ambassador-program/',
            image: {
              dark:
                'fl_lossy,f_auto,c_scale,w_330/v1612373628/debbie.codes/ambassador-program-logo-white_twmp4l.png',
              light:
                'fl_lossy,f_auto,c_scale,w_330/v1612373628/debbie.codes/ambassador-program-logo-black_u3d5z0.png'
            },

            about:
              'Part of a global team of ambassadors empowering communities and help make the Internet a safer place by attending and hosting meetups, conferences, and other events that focus on authentication, security, and identity topics.'
          }
        ]
      }
    },

    head() {
      return {
        title: this.title,
        meta: [
          {
            hid: 'description',
            name: 'description',
            content: this.description
          }
        ],
        link: [
          {
            hid: 'canonical',
            rel: 'canonical',
            href: `https://debbie.codes/about`
          }
        ]
      }
    }
  }
</script>
<style scoped>
  .parent {
    display: grid;
    grid-template-columns: 1fr 3fr;
    grid-template-rows: 1fr;
    grid-column-gap: 20px;
    grid-row-gap: 0px;
  }
</style>
