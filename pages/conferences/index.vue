<template>
  <div class="wrapper">
    <h1>conferences</h1>
    <div v-for="(conf, index) in conferences" :key="index" class="flex">
      <ConferenceLinks
        :img="conf.img"
        :alt="conf.alt"
        :place="conf.place"
        :type="conf.type"
        :link="conf.link"
        :url="conf.url"
      />
    </div>
  </div>
</template>

<script>
import data from '@/data/conferences'
import ConferenceLinks from '@/components/conference-links'
export default {
  components: {
    ConferenceLinks,
  },
  data() {
    return {
      conferences: data.conferences,
    }
  },
}
</script>
