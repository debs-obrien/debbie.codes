<template>
  <div class="container mt-10">
    <SocialHead
      title="conferences"
      description="All the conferences I have attended"
    />
    <AppTitle>Conferences</AppTitle>

    <div class="buttons flex flex-wrap">
      <button class="btn" @click="FilterConferenceByType('')"> All </button>
      <button class="btn" @click="FilterConferenceByType('Speaker')">
        Speaker
      </button>
      <button class="btn" @click="FilterConferenceByType('Lightening Talk')">
        Lightening Talk
      </button>
      <button class="btn" @click="FilterConferenceByType('MC')"> MC </button>
      <button class="btn" @click="FilterConferenceByType('Attendee')">
        Attendee
      </button>
    </div>
    <div v-for="(conf, index) in conferenceList" :key="index" class="flex">
      <ConferenceLinks
        :img="conf.img"
        :alt="conf.alt"
        :place="conf.place"
        :name="conf.name"
        :date="conf.date"
        :type="conf.type"
        :url="conf.url"
        :notes-url="conf.notesUrl"
        :blog-url="conf.blogUrl"
        :video-url="conf.videoUrl"
        :talk="conf.talk"
        :slides-url="conf.slidesUrl"
        :country="conf.country"
        class="conference"
      />
    </div>
  </div>
</template>

<script>
  import gsap from 'gsap'
  import gql from 'graphql-tag'
  import { print } from 'graphql/language/printer'

  const QUERY = gql`
    query {
      conferences(order_by: { date: desc }) {
        name
        alt
        blogUrl
        country
        date
        img
        notesUrl
        place
        slidesUrl
        type
        url
        talk
        videoUrl
      }
    }
  `
  export default {
    async asyncData({ app }) {
      const { data } = await app.$hasura({
        query: print(QUERY)
      })
      return {
        conferences: data.conferences
      }
    },
    data() {
      return {
        type: '',
        title: "Debbie's conferences where she has given talks",
        description:
          'List of Conferences that Debbie is going to speak at mainly about Nuxt'
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
            href: `https://debbie.codes/conferences`
          }
        ]
      }
    },
    computed: {
      conferenceList() {
        return this.conferences.filter(el => el.type.match(this.type))
      }
    },
    mounted() {
      gsap.fromTo(
        '.conference',
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.5,
          ease: 'power1.out',
          stagger: {
            each: 0.1,
            from: 'bottom'
          }
        }
      )
    },

    methods: {
      FilterConferenceByType(type) {
        this.type = type
      }
    }
  }
</script>
<style scoped>
  .btn {
    --bg-opacity: 1;
    background-color: #d8002d;
    background-color: rgba(216, 0, 45, var(--bg-opacity));
    --text-opacity: 1;
    color: #fff;
    color: rgba(255, 255, 255, var(--text-opacity));
    padding: 0.5rem;
    border-radius: 0.25rem;
    --border-opacity: 1;
    border: 2px solid #d8002d;
    border-color: rgba(216, 0, 45, var(--border-opacity));
    font-family: Saira;
    margin-bottom: 1rem;
    margin-right: 1rem;
  }
</style>
