<template>
  <div class="container mt-10">
    <h1 class="main-heading">Workshops</h1>
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
        :year="workshop.year"
        :notes-url="workshop.notesUrl"
        :blog-url="workshop.blogUrl"
        :video-url="workshop.videoUrl"
        :slides-url="workshop.slidesUrl"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import WorkshopLinks from '@/components/workshop-links'
export const workshops = gql`
  query workshops {
    workshops(order_by: { date: desc }) {
      alt
      blogUrl
      duration
      id
      img
      name
      place
      slidesUrl
      title
      topic
      url
      videoUrl
      year
      date
    }
  }
`
export default {
  components: {
    WorkshopLinks
  },
  data() {
    return {
      workshops: []
    }
  },
  apollo: {
    $loadingKey: 'loading',
    workshops: {
      query: workshops
    }
  }
}
</script>
