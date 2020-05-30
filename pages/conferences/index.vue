<template>
  <div class="container mt-10">
    <h1 class="main-heading">conferences</h1>

    <div class="buttons flex flex-wrap">
      <button class="btn" @click="FilterConferenceByType('')">
        All
      </button>
      <button class="btn" @click="FilterConferenceByType('Speaker')">
        Speaker
      </button>
      <button class="btn" @click="FilterConferenceByType('Lightening Talk')">
        Lightening Talk
      </button>
      <button class="btn" @click="FilterConferenceByType('MC')">
        MC
      </button>
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
import ConferenceLinks from '@/components/ConferenceLinks'

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
  components: {
    ConferenceLinks
  },
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
      type: ''
    }
  },
  computed: {
    conferenceList() {
      return this.conferences.filter((el) => el.type.match(this.type))
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
  @apply bg-primary text-white py-2 px-2 mb-4 mr-4 rounded border-solid border-2 border-primary btn font-Saira mb-4 mr-4;
}
</style>
