<template>
  <div>
    <h1>conferences</h1>
    <div v-for="(conf, index) in conferences" :key="index" class="flex">
      <ConferenceLinks
        :img="conf.img"
        :alt="conf.alt"
        :place="conf.place"
        :type="conf.type"
        :url="conf.url"
        :notesUrl="conf.notesUrl"
        :blogUrl="conf.blogUrl"
        :videoUrl="conf.videoUrl"
        :talk="conf.talk"
        :slidesUrl="conf.slidesUrl"
      />
    </div>
  </div>
</template>

<script>
import conferences from '@/data/conferences'
import ConferenceLinks from '@/components/conference-links'
export default {
  components: {
    ConferenceLinks,
  },
  data() {
    return {
      conferences: conferences.conferences,
    }
  },
}
</script>
