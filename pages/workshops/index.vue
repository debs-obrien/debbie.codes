<template>
  <div>
    <h1>Workshops</h1>
    <div v-for="(workshop, index) in workshops" :key="index" class="flex">
      <WorkshopLinks
        :img="workshop.img"
        :alt="workshop.name"
        :place="workshop.place"
        :duration="workshop.duration"
        :topic="workshop.topic"
        :name="workshop.name"
        :title="workshop.title"
        :url="workshop.url"
        :notesUrl="workshop.notesUrl"
        :blogUrl="workshop.blogUrl"
        :videoUrl="workshop.videoUrl"
        :slidesUrl="workshop.slidesUrl"
      />
    </div>
  </div>
</template>

<script>
import workshops from '@/data/workshops'
import WorkshopLinks from '@/components/workshop-links'
export default {
  components: {
    WorkshopLinks,
  },
  data() {
    return {
      workshops: workshops.workshops,
    }
  },
}
</script>
