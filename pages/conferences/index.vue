<template>
  <div class="container mt-10">
    <h1 class="main-heading">conferences</h1>

    <div class="buttons flex flex-wrap">
      <button
        class="grax_button-sm mb-4 mr-4"
        @click="FilterConferenceByType('')"
      >
        All
      </button>
      <button
        class="grax_button-sm mb-4 mr-4"
        @click="FilterConferenceByType('Speaker')"
      >
        Speaker
      </button>
      <button
        class="grax_button-sm mb-4 mr-4"
        @click="FilterConferenceByType('Lightening Talk')"
      >
        Lightening Talk
      </button>
      <button
        class="grax_button-sm mb-4 mr-4"
        @click="FilterConferenceByType('MC')"
      >
        MC
      </button>
      <button
        class="grax_button-sm mb-4"
        @click="FilterConferenceByType('Attendee')"
      >
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
        :notesUrl="conf.notesUrl"
        :blogUrl="conf.blogUrl"
        :videoUrl="conf.videoUrl"
        :talk="conf.talk"
        :slidesUrl="conf.slidesUrl"
        :country="conf.country"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import ConferenceLinks from '@/components/conference-links'

export const conferencesQuery = gql`
  query conferences {
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
    ConferenceLinks,
  },

  async asyncData({ app, route, error }) {
    try {
      const client = app.apolloProvider.defaultClient
      const response = await client.query({
        query: conferencesQuery,
        variables: {},
      })
      return {
        conferences: response.data.conferences,
      }
    } catch (error) {}
  },
  data() {
    return {
      type: '',
      loading: 0,
      conferences: [],
    }
  },
  computed: {
    conferenceList() {
      return this.conferences.filter((el) => el.type.match(this.type))
    },
  },

  methods: {
    FilterConferenceByType(type) {
      this.type = type
    },
  },
}
</script>
