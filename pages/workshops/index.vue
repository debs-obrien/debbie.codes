<template>
  <div class="container mt-10">
    <h1 class="main-heading">
      Workshops
    </h1>
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
        class="workshop"
      />
    </div>
  </div>
</template>

<script>
import gql from 'graphql-tag'
import { print } from 'graphql/language/printer'
import gsap from 'gsap'
import WorkshopLinks from '@/components/WorkshopLinks'
const QUERY = gql`
  query {
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
  async asyncData ({ app }) {
    const { data } = await app.$hasura({
      query: print(QUERY)
    })
    return {
      workshops: data.workshops
    }
  },
  mounted () {
    gsap.fromTo(
      '.workshop',
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
  }
}
</script>
